import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import EventData from "../models/EventData";
import firestoreConnection from "../configuration/FirestoreConnection";

const eventsReference = collection(firestoreConnection, "Events");

async function findAll(): Promise<EventData[]> {
  const findAllQuery = query(eventsReference);
  const documents = await getDocs(findAllQuery);
  return [
    ...documents.docs.map(
      (document) => ({ ...document.data(), id: document.id } as EventData)
    ),
  ];
}

async function save(event: EventData) {
  await setDoc(doc(eventsReference), mapEventData(event));
}

async function update(event: EventData) {
  await updateDoc(doc(eventsReference, event.id), mapEventData(event));
}

async function remove(id: string) {
  await deleteDoc(doc(eventsReference, id));
}

function mapEventData(event: EventData) {
  return {
    client_data: { ...event.client_data },
    date: event.date,
    hour: { ...event.hour },
  };
}

const EventRepository = {
  findAll,
  save,
  update,
  remove,
};

export default EventRepository;
