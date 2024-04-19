import EventData from "../models/EventData";
import EventRepository from "../repository/EventRepository";

async function findAll(): Promise<EventData[]> {
  return await EventRepository.findAll();
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
