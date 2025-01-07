import { useState } from "react";
import { Form, Button, Badge, Container, Row, Col } from "react-bootstrap";
import { collection,doc, addDoc, updateDoc,arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useFirebase } from "./FirebaseContext";
import { firestore } from 'firebase/app';
import IncidentTags from "./incident/incidentform/IncidentTags";

function ItemForm() {
  const [selectedTags, setSelectedTags] = useState([]);
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
  ];

  const { db } = useFirebase();
  const storage = getStorage();

  const [formData, setFormData] = useState({
    description: "",
    dateLost: "",
    phoneNumber: "",
    tags: [],
    location: "",
    files: [],
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

  const handleTagsChange = (tag) => {
    setFormData((prevState) => {
      const tags = prevState.tags.includes(tag)
        ? prevState.tags.filter((t) => t !== tag)
        : [...prevState.tags, tag];
      return { ...prevState, tags };
    });
  };

  const selectLocation = (location) => {
    setFormData((prevState) => ({ ...prevState, location }));
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

    if (!formData.location) newErrors.location = "Location is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
  
        if (!currentUser) {
          alert("You must be logged in to submit an item.");
          return;
        }
  
        const fileUrls = [];
  
        const docData = {
          uid: currentUser.uid,
          tags: formData.tags,
          description: formData.description,
          location: formData.location,
          dateLost: formData.dateLost,
          phoneNumber: formData.phoneNumber,
          status: "Unclaimed",
          imagePaths: [],
        };
  
        // Add the new document to the "Items" collection
        const docRef = await addDoc(collection(db, "Incidents"), docData);
  
        // Upload files and get their URLs
        for (const file of formData.files) {
          const fileRef = ref(storage, `IncidentsPhotos/${docRef.id}/${file.name}`);
          await uploadBytes(fileRef, file);
          const fileUrl = await getDownloadURL(fileRef);
          fileUrls.push(fileUrl);
        }
  
        // Update the document with the file URLs
        await updateDoc(docRef, {
          imagePaths: fileUrls,
        });
  
        // Update the "Users" collection to include the new doc ID in the incidents array
        const userDocRef = doc(db, "Users", currentUser.uid);
        await updateDoc(userDocRef, {
          incidents: arrayUnion(docRef.id),
        });
  
        alert("Form submitted successfully.");
        setFormData({
          description: "",
          dateLost: "",
          phoneNumber: "",
          tags: [],
          location: "",
          files: [],
        });
      } catch (e) {
        console.error("Error adding document: ", e);
        alert(`Error adding document: ${e}`);
      }
    }
  };

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="w-100" style={{ maxWidth: "600px" }}>
          <Col>
            <h2 className="text-center mb-4">Incidence Report</h2>
            <Form>

              <IncidentTags onTagsChange={handleTagsChange} />

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
                <Form.Label>Date of Incidence</Form.Label>
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
                <Form.Label>Contact Phone Number</Form.Label>
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
                <Form.Label>Incidence Location</Form.Label>
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
                  <Form.Text className="text-danger">
                    {errors.location}
                  </Form.Text>
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

              <Button
                variant="primary"
                onClick={handleSubmit}
                className="w-100"
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ItemForm;
