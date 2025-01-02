import { useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { useFirebase } from "./FirebaseContext";

function ItemForm({ show, handleClose }) {
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
  ];
  const locationTags = [
    "Lusaka",
    "Kitwe",
    "Ndola",
    "Kabwe",
    "Chingola",
    "Livingstone",
    "Luanshya",
    "Chipata",
    "Mufulira",
    "Kasama",
    "Mazabuka",
    "Solwezi",
    "Monze",
    "Mongu",
    "Choma",
    "Kalulushi",
    "Mansa",
    "Kapiri Mposhi",
    "Mpika",
    "Nchelenge",
    "Siavonga",
    "Kafue",
    "Petauke",
    "Kaoma",
    "Mbala",
  ]; // Location tag options
  const { db } = useFirebase(); // Access Firestore from context
  const storage = getStorage(); // Initialize Firebase Storage

  const [formData, setFormData] = useState({
    description: "",
    dateLost: "",
    phoneNumber: "",
    tags: [],
    location: "", // Location tag field
    files: [], // Array of files to upload
    Comments: [], // Array of files to upload
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(
      (file) => file.size <= 500 * 1024 // 500KB size limit
    );

    if (selectedFiles.length > 5) {
      alert("You can upload a maximum of 5 files.");
      return;
    }

    if (validFiles.length !== selectedFiles.length) {
      alert("Some files exceed the 500KB size limit and were not added.");
    }

    setFormData({ ...formData, files: validFiles });
  };

  const toggleTag = (tag) => {
    setFormData((prevState) => {
      const tags = prevState.tags.includes(tag)
        ? prevState.tags.filter((t) => t !== tag) // Remove tag
        : [...prevState.tags, tag]; // Add tag
      return { ...prevState, tags };
    });
  };

  const selectLocation = (location) => {
    setFormData((prevState) => ({
      ...prevState,
      location, // Update location field with the selected value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.dateLost) newErrors.dateLost = "Date Lost is required.";

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }
    if (!formData.location) {
      newErrors.location = "Location is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Get the current authenticated user's UID
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          alert("You must be logged in to submit an item.");
          return;
        }

        // Initialize an array to store file URLs
        const fileUrls = [];

        // Create a document in Firestore first to get its ID
        const docData = {
          uid: currentUser.uid, // Add UID to document data
          tags: formData.tags,
          description: formData.description,
          location: formData.location,
          dateLost: formData.dateLost,
          phoneNumber: formData.phoneNumber,
          status: "Unclaimed", // Default status
          imagePaths: [], // Placeholder for image paths
        };

        const docRef = await addDoc(collection(db, "Items"), docData);

        // Upload each file to Firebase Storage
        for (const file of formData.files) {
          const fileRef = ref(storage, `${docRef.id}/${file.name}`);
          await uploadBytes(fileRef, file); // Upload file
          const fileUrl = await getDownloadURL(fileRef); // Get downloadable URL
          fileUrls.push(fileUrl); // Add URL to the array
        }

        // Update Firestore document with imagePaths
        await addDoc(collection(db, "Items"), {
          imagePaths: fileUrls,
        });

        console.log("Document written with ID: ", docRef.id);
        alert("Form submitted successfully.");
        handleClose(); // Close modal after successful submission
      } catch (e) {
        console.error("Error adding document: ", e);
        alert(`Error adding document: ${e}`);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Lost and Found Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formTags">
            <Form.Label>Item Type</Form.Label>
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

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter item description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDateLost">
            <Form.Label>Date Lost</Form.Label>
            <Form.Control
              type="date"
              name="dateLost"
              value={formData.dateLost}
              onChange={handleChange}
              isInvalid={!!errors.dateLost}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateLost}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              isInvalid={!!errors.phoneNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Incident Location</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {locationTags.map((location) => (
                <Badge
                  key={location}
                  pill
                  className={`p-2 cursor-pointer ${
                    formData.location === location
                      ? "bg-primary text-white"
                      : "bg-light text-dark"
                  }`}
                  onClick={() => selectLocation(location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
            {errors.location && (
              <Form.Text className="text-danger">{errors.location}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFiles">
            <Form.Label>Upload Photos (Max 5, 500KB each)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ItemForm;
