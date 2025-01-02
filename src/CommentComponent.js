import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useFirebase } from "./FirebaseContext";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

const CommentComponent = ({ incidentId, onCommentSubmit, onImageUpload }) => {
  const [comments, setComments] = useState("");
  // const [selectedImages, setSelectedImages] = useState([]);
  const { db } = useFirebase();

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   setSelectedImages(files);
  //   if (onImageUpload) {
  //     onImageUpload(files); // Pass the uploaded images back to the parent
  //   }
  // };

  const handleCommentChange = (e) => {
    setComments(e.target.value);
    if (onCommentSubmit) {
      onCommentSubmit(e.target.value); // Pass the comment back to the parent
    }
  };

  const handleSubmit = async () => {
    try {
      const imageUrls = [];

      // Upload images to Firebase Storage
      //   for (const file of selectedImages) {
      //     const storageRef = ref(storage, `comments/${incidentId}/${file.name}`);
      //     const snapshot = await uploadBytes(storageRef, file);
      //     const imageUrl = snapshot.metadata.fullPath;
      //     imageUrls.push(imageUrl);
      //   }

      // Add comment to Firebase Firestore
      const docRef = await addDoc(collection(db, "comments"), {
        incidentId,
        text: comments,
        images: imageUrls,
        timestamp: new Date(),
      });

      // Add the new document ID to the "Items" collection
      const itemDocRef = doc(db, "Items", incidentId);
      await updateDoc(itemDocRef, {
        comments: arrayUnion(docRef.id),
      });

      // Clear inputs after successful submission
      setComments("");
      // setSelectedImages([]);

      console.log("Comment submitted successfully");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <Card style={{ width: "100%" }} className="mt-3">
      <Card.Body>
        {/* Comments Section */}
        <Form.Group controlId={`comments-${incidentId}`}>
          <Form.Label>Add Your Comments:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comments}
            onChange={handleCommentChange}
            placeholder="Write your comment here..."
          />
        </Form.Group>

        {/* Image Upload */}
        {/* <Form.Group controlId={`imageUpload-${incidentId}`} className="mt-3">
          <Form.Label>Upload Additional Images:</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleImageUpload}
            accept="image/*"
          />
          {selectedImages.length > 0 && (
            <div className="mt-2">
              <strong>Selected Images:</strong>
              <ul>
                {selectedImages.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </Form.Group> */}

        {/* Submit Button */}
        <Button variant="primary" className="mt-3" onClick={handleSubmit}>
          Comment
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CommentComponent;
