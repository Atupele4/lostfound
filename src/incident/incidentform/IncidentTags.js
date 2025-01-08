import React, { useState, useEffect } from "react";
import { Form, Badge } from "react-bootstrap";
import { useFirebase } from "../../FirebaseContext";
import { collection, addDoc, getDocs } from "firebase/firestore";

const IncidentTags = ({ onTagsChange, selectedTags, tagError }) => {
  const [tags, setTags] = useState([]); // Tags fetched from Firestore
  const [newTag, setNewTag] = useState(""); // New tag input value
  const { db } = useFirebase();

  const predefinedTags = [
    "Wallets",
    "Keys",
    "Phones",
    "Bags",
    "Laptops",
    "Watches",
    "Glasses",
    "Jewelry",
    "ID Cards",
    "Credit/Debit Cards",
    "Clothing Items",
    "Umbrellas",
    "Headphones/Earbuds",
    "Shoes",
    "Cameras",
    "Tablets",
    "Books",
    "Power Banks",
    "Documents",
    "Water Bottles",
    "Television",
  ];

  const toggleTag = (tag) => {
    onTagsChange(tag); // Notify parent of updated tag selection
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsRef = collection(db, "tags");
        const snapshot = await getDocs(tagsRef);
        const tagsData = snapshot.docs.map((doc) => doc.data());
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [db]);

  return (
    <Form.Group className="mb-3" controlId="formTags">
      <Form.Label>Incident Tags</Form.Label>
      <div className="d-flex flex-wrap gap-2">
        {predefinedTags.map((tag) => (
          <Badge
            key={tag}
            pill
            className={`p-2 cursor-pointer ${
              selectedTags.includes(tag)
                ? "bg-primary text-white" // Highlight selected tag
                : "bg-light text-dark"
            }`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
      {tagError && (
        <Form.Text className="text-danger">{tagError}</Form.Text>
      )}
    </Form.Group>
  );
};

export default IncidentTags;
