import React, { useEffect, useState } from "react";
import { Card, ListGroup, Image } from "react-bootstrap";
import { getFirestore, getDoc, doc } from "firebase/firestore";

const Comments = ({ incidentIds }) => {
  const [comments, setComments] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (incidentIds.length === 0) return;

        const fetchedComments = [];

        for (const documentId of incidentIds) {
          const docRef = doc(db, "comments", documentId);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            fetchedComments.push({
              id: docSnapshot.id,
              ...docSnapshot.data(),
            });
          }
        }

        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [incidentIds, db]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <div>
      {comments.map((comment, index) => (
        <Card key={index} className="mt-3">
          <Card.Body>
            {/* <Card.Title>Incident ID: {comment.incidentId}</Card.Title> */}
            <Card.Text>
              <strong>Comment:</strong> {comment.text}
            </Card.Text>
            <Card.Text>
              <strong>Timestamp:</strong> {formatTimestamp(comment.timestamp)}
            </Card.Text>
            {comment.images && comment.images.length > 0 && (
              <div>
                <strong>Images:</strong>
                <ListGroup className="mt-2">
                  {comment.images.map((imageUrl, i) => (
                    <ListGroup.Item key={i}>
                      <Image src={imageUrl} alt={`Image ${i + 1}`} thumbnail />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Comments;
