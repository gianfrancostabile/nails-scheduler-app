import { Subject } from "rxjs";
import EventData from "../models/event/EventData";
import EventRepository from "../repository/EventRepository";

function findAll(uid?: string): Subject<EventData[]> {
  return EventRepository.findAll(uid);
}

function save(event: EventData): Promise<void> {
  return EventRepository.save(event);
}

function update(event: EventData): Promise<void> {
  return EventRepository.update(event);
}

function remove(id: string): Promise<void> {
  return EventRepository.remove(id);
}

const EventService = {
  findAll,
  save,
  update,
  remove,
};

export default EventService;
