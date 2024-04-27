import { collection, getDocs, query } from "firebase/firestore";
import firestoreConnection from "../configuration/FirestoreConnection";

const eventsReference = collection(firestoreConnection, "ValidUsers");

async function findAll(): Promise<string[]> {
  const documents = await getDocs(query(eventsReference));
  return [...documents.docs.map((document) => document.data().email)];
}

const ValidUserRepository = {
  findAll,
};

export default ValidUserRepository;
