import { Event } from "react-big-calendar";
import EventData from "./EventData";

interface EventCalendar extends Event {
  event_data: EventData;
}

export default EventCalendar;
