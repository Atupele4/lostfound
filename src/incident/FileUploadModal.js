import React, { use, useState, useEffect } from "react";
import { Modal, Button, Form, ProgressBar } from "react-bootstrap";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { updateDoc, getDoc } from "firebase/firestore";
import { collection, doc, addDoc, arrayUnion } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFirebase } from "../FirebaseContext";
// import React, { useState, useEffect } from "react";
// import { AiOutlineUpload } from "react-icons/ai";

function FileUploadModal({ incidentDoc }) {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
  const { db } = useFirebase();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
    setUploadSuccess(false);
    setDownloadURL("");
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `${incidentDoc.id}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Upload files and get their URLs
    //   for (const file of formData.files) {
    //     const fileRef = ref(storage, `${incidentDoc.id}/${file.name}`);
    //     await uploadBytes(fileRef, file);
    //     const fileUrl = await getDownloadURL(fileRef);
    //     fileUrls.push(fileUrl);
    //   }

    // Update the document with the file URLs

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUploadSuccess(true);
        setDownloadURL(url);

        try {
          const docRef = doc(db, "Items", incidentDoc.id);
          const docSnap = await getDoc(docRef);
        
          let urls = docSnap.data().imagePaths;
          if(urls === undefined) {
            urls = [];
          }
          console.log(docSnap.data().imagePaths)
          urls.push(url);
        //   console.log(urls);

          //   Update the document with the file URLs
          await updateDoc(docRef, {
            imagePaths: urls,
          });
          alert("Form submitted successfully.");
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    );
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        {/* <AiOutlineUpload style={{ marginRight: "5px" }} /> */}
        Upload File
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile">
              <Form.Label>Select a file to upload:</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
          {progress > 0 && (
            <ProgressBar
              now={progress}
              label={`${progress}%`}
              className="mt-3"
            />
          )}
          {uploadSuccess && (
            <div className="alert alert-success mt-3">
              File uploaded successfully!{" "}
              <a href={downloadURL} target="_blank" rel="noopener noreferrer">
                View File
              </a>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FileUploadModal;
