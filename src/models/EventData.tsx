import { Timestamp } from "firebase/firestore";

export default interface EventData {
  id?: string,
  client_data: {
    name: string;
    phone: string;
    email: string;
  };
  date: Timestamp;
  hour: {
    start: string;
    end: string;
  };
}
