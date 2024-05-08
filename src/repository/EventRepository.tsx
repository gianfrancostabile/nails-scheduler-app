import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Subject } from "rxjs";
import firestoreConnection from "../configuration/FirestoreConnection";
import EventData from "../models/event/EventData";

const eventsReference = collection(firestoreConnection, "Events");

function findAll(uid?: string): Subject<EventData[]> {
  const subject = new Subject<EventData[]>();
  onSnapshot(
    uid
      ? query(eventsReference, where("created_by", "==", uid))
      : query(eventsReference),
    (querySnapshot) => {
      const events: EventData[] = [];
      querySnapshot.forEach((document) =>
        events.push({ ...document.data(), id: document.id } as EventData)
      );
      subject.next(events);
    },
    (_) => {
      subject.next([]);
    }
  );
  return subject;
}

function save(event: EventData): Promise<void> {
  return setDoc(doc(eventsReference), mapEventData(event));
}

function update(event: EventData): Promise<void> {
  return updateDoc(doc(eventsReference, event.id), mapEventData(event));
}

function remove(id: string): Promise<void> {
  return deleteDoc(doc(eventsReference, id));
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
