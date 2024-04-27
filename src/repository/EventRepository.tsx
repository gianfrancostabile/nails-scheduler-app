import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import EventData from "../models/event/EventData";
import firestoreConnection from "../configuration/FirestoreConnection";

const eventsReference = collection(firestoreConnection, "Events");

async function findAll(uid?: string): Promise<EventData[]> {
  const documents = await getDocs(
    uid
      ? query(eventsReference, where("created_by", "==", uid))
      : query(eventsReference)
  );
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
    created_by: event.created_by,
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
