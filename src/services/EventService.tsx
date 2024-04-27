import EventData from "../models/event/EventData";
import EventRepository from "../repository/EventRepository";

async function findAll(uid?: string): Promise<EventData[]> {
  return await EventRepository.findAll(uid);
}

async function save(event: EventData) {
  await EventRepository.save(event);
}

async function update(event: EventData) {
  await EventRepository.update(event);
}

async function remove(id: string) {
  await EventRepository.remove(id);
}

const EventService = {
  findAll,
  save,
  update,
  remove,
};

export default EventService;
