import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { listAll } from "firebase/storage";

/**
 * Deletes a document from a specified Firestore collection.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} docId - The ID of the document to delete.
 * @returns {Promise<void>} - A promise that resolves when the document is deleted.
 */
export async function deleteFirestoreDocument(collectionName, docId) {
  try {
    const db = getFirestore();
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log(
      `Document with ID ${docId} deleted from collection ${collectionName}`
    );
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete the document.");
  }
}

export async function deleteFileByUrl(fileUrl) {
  const storage = getStorage();
  try {
    // Create a reference to the file to delete
    const fileRef = ref(storage, fileUrl);
    // Delete the file
    await deleteObject(fileRef);
    console.log(`File deleted successfully: ${fileUrl}`);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

export async function deleteFolder(folderPath) {
  const storage = getStorage();
  try {
    const folderRef = ref(storage, folderPath);

    console.log(folderRef);
    // List all files and folders in the specified folder
    const { items, prefixes } = await listAll(folderRef);

    // Delete all files in the folder
    const fileDeletionPromises = items.map((fileRef) => deleteObject(fileRef));

    // Recursively delete subfolders
    const folderDeletionPromises = prefixes.map((subFolderRef) =>
      deleteFolder(subFolderRef.fullPath, storage)
    );

    // Wait for all deletions to complete
    await Promise.all([...fileDeletionPromises, ...folderDeletionPromises]);

    console.log(`Folder deleted successfully: ${folderPath}`);
    return true;
  } catch (error) {
    console.error("Error deleting folder:", error);
    return false;
  }
}
