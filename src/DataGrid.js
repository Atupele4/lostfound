import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref,getStorage } from "firebase/storage";
import { useFirebase } from "./FirebaseContext";

function DataGrid() {
  const { db } = useFirebase(); 
  const storage = getStorage(); // Initialize Firebase Storage// Access Firestore and Storage from context
  const [items, setItems] = useState([]); // Stores the fetched items
  const [lastDoc, setLastDoc] = useState(null); // Stores the last document for pagination
  const [hasMore, setHasMore] = useState(true); // Determines if more pages exist
  const ITEMS_PER_PAGE = 5; // Number of items per page

  const locationColors = {
    Lusaka: "border-primary",
    Kitwe: "border-success",
    Ndola: "border-danger",
    Kabwe: "border-warning",
    Chingola: "border-info",
    Livingstone: "border-secondary",
    // Add more locations and colors as needed
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (nextPage = false) => {
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
        q = query(itemsRef, orderBy("dateLost", "desc"), limit(ITEMS_PER_PAGE));
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
  };
  

  return (
    <div>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {items.map((item, index) => (
          <Card
  key={item.id}
  style={{ width: "18rem" }}
  className={`shadow-sm ${locationColors[item.location] || "border-light"}`} // Default to 'border-light' if location is not mapped
>
  {item.images && item.images.length > 0 && (
    <Carousel>
      {item.images.map((image, imageIndex) => (
        <Carousel.Item key={imageIndex}>
          <img
            src={image}
            alt={`Item ${index + 1} - Image ${imageIndex + 1}`}
            className="d-block w-100"
            style={{ height: "200px", objectFit: "cover" }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  )}
  <Card.Body>
    <Card.Title>
      #{index + 1}: {item.tags && item.tags.length > 0 ? item.tags.join(", ") : "N/A"}
    </Card.Title>
    <Card.Subtitle className="mb-2 text-muted">{item.status || "Unclaimed"}</Card.Subtitle>
    <Card.Text>
      <strong>Description:</strong> {item.description || "N/A"} <br />
      <strong>Location Lost:</strong> {item.location || "N/A"} <br />
      <strong>Date Lost:</strong> {item.dateLost || "N/A"} <br />
      <strong>Date Found:</strong> {item.dateFound || "N/A"} <br />
      <strong>Phone Number:</strong> {item.phoneNumber || "N/A"}
    </Card.Text>
  </Card.Body>
</Card>
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
