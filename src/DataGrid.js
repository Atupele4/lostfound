import React, { useState, useEffect, useCallback } from "react";
import Button from "react-bootstrap/Button";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { useFirebase } from "./FirebaseContext";
import CardComponent from "./CardComponent";

function DataGrid() {
  const { db } = useFirebase();
  const storage = getStorage(); // Initialize Firebase Storage
  const [items, setItems] = useState([]); // Stores the fetched items
  const [lastDoc, setLastDoc] = useState(null); // Stores the last document for pagination
  const [hasMore, setHasMore] = useState(true); // Determines if more pages exist
  const ITEMS_PER_PAGE = 20; // Number of items per page

  const locationColors = {
    Lusaka: "border-primary",
    Kitwe: "border-success",
    Ndola: "border-danger",
    Kabwe: "border-warning",
    Chingola: "border-info",
    Livingstone: "border-secondary",
    // Add more locations and colors as needed
  };

  // Use useCallback to memoize fetchItems function to avoid unnecessary re-creations
  const fetchItems = useCallback(
    async (nextPage = false) => {
      try {
        const itemsRef = collection(db, "Items");
        let q;

        if (nextPage && lastDoc) {
          // Query for the next page
          q = query(
            itemsRef,
            orderBy("dateLost", "desc"),
            startAfter(lastDoc),
            limit(ITEMS_PER_PAGE)
          );
        } else {
          // Query for the first page
          q = query(
            itemsRef,
            orderBy("dateLost", "desc"),
            limit(ITEMS_PER_PAGE)
          );
        }

        const querySnapshot = await getDocs(q);

        const fetchedItems = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Ensure imagePaths are valid storage paths
            const images = await Promise.all(
              (data.imagePaths || []).map(async (path) => {
                try {
                  const url = await getDownloadURL(ref(storage, path));
                  return url;
                } catch (error) {
                  console.error(`Error fetching URL for path ${path}:`, error);
                  return null; // Skip invalid paths
                }
              })
            );

            return { id: doc.id, ...data, images: images.filter(Boolean) }; // Filter out null entries
          })
        );

        setItems((prevItems) =>
          nextPage ? [...prevItems, ...fetchedItems] : fetchedItems
        );
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE); // Check if there's more data
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    },
    [db, lastDoc, storage]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]); // Add fetchItems to the dependency array

  return (
    <div>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {items.map((item, index) => (
          <CardComponent
            key={item.id}
            item={item}
            index={index}
            locationColors={locationColors}
          />
        ))}
      </div>
      <div className="d-flex justify-content-center mt-3">
        <Button
          variant="primary"
          onClick={() => fetchItems(true)}
          disabled={!hasMore}
        >
          Load More
        </Button>
      </div>
    </div>
  );
}

export default DataGrid;
