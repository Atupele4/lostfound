import React, { useState, useEffect } from "react";
import { Form, Badge } from "react-bootstrap";
import { useFirebase } from "../../FirebaseContext";
import { collection, addDoc, getDocs } from "firebase/firestore";

const IncidentTags = ({ onTagsChange }) => {
  const [tags, setTags] = useState([]); // Tags fetched from Firestore
  const [newTag, setNewTag] = useState(""); // New tag input value
  const [formData, setFormData] = useState({ tags: [] }); // Selected tags
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
    setFormData((prevState) => {
      const tags = prevState.tags.includes(tag)
        ? prevState.tags.filter((t) => t !== tag)
        : [...prevState.tags, tag];

      // Notify parent of updated tags
      onTagsChange(tag);

      return { ...prevState, tags };
    });
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

  const handleAddTag = async () => {
    try {
      if (newTag.trim() === "") return;

      const tagsRef = collection(db, "tags");
      await addDoc(tagsRef, { name: newTag });

      // Clear input field and update tags state
      setNewTag("");
      setTags((prevTags) => [...prevTags, { name: newTag }]);
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  return (
    <>
      <Form.Group className="mb-3" controlId="formTags">
        <Form.Label>Incident Tags</Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {predefinedTags.map((tag) => (
            <Badge
              key={tag}
              pill
              className={`p-2 cursor-pointer ${
                formData.tags.includes(tag)
                  ? "bg-primary text-white"
                  : "bg-light text-dark"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </Form.Group>
    </>
  );
};

export default IncidentTags;
