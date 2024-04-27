import { Timestamp } from "firebase/firestore";
import ClientData from "../client/Client";

export default interface EventData {
  id?: string,
  created_by: string,
  client_data: ClientData;
  date: Timestamp;
  hour: {
    start: string;
    end: string;
  };
}
