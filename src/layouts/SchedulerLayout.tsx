import { createContext, useEffect, useState } from "react";
import AddEventModal from "../components/AddEventModal/AddEventModal";
import Calendar from "../components/Calendar";
import SchedulerHeader from "../components/SchedulerButtons";
import EventData from "../models/EventData";
import EventService from "../services/EventService";
import SpinnerModal from "../components/SpinnerModal";

export interface SchedulerPropsContext {
  events: EventData[];
  selectedEvent?: EventData;
  setSelectedEvent: Function;
  submitEvent: Function;
  deleteEvent: Function;
  displayAddEventModal: Function;
  closeAddEventModal: Function;
}

const initialContext: SchedulerPropsContext = {
  events: [],
  selectedEvent: undefined,
  setSelectedEvent: (event: EventData) => {},
  submitEvent: (event: EventData) => {},
  deleteEvent: (id: string) => {},
  displayAddEventModal: () => {},
  closeAddEventModal: () => {},
};

export const SchedulerContext = createContext(initialContext);

const SchedulerLayout = () => {
  const [events, setEvents] = useState([] as EventData[]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>();
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showScreenLoading, setShowScreenLoading] = useState(true);

  useEffect(() => {
    setShowScreenLoading(true);
    findAllEvents();
  }, []);

  const findAllEvents = async () => {
    const newEvents: EventData[] = await EventService.findAll();
    setEvents([...newEvents]);
    setShowScreenLoading(false);
  };

  const submitEvent = async (event: EventData) => {
    try {
      setShowScreenLoading(true);
      if (event.id) {
        await EventService.update(event);
      } else {
        await EventService.save(event);
      }
      await findAllEvents();
    } catch (e) {
      setShowScreenLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setShowScreenLoading(true);
      await EventService.remove(id);
      await findAllEvents();
    } catch (e) {
      setShowScreenLoading(false);
    }
  };

  const displayAddEventModal = () => {
    setShowAddEventModal(true);
  };

  const closeAddEventModal = () => {
    setSelectedEvent(undefined);
    setShowAddEventModal(false);
  };

  const onSelectEvent = (event: EventData) => {
    setSelectedEvent(event);
    setShowAddEventModal(true);
  };

  return (
    <SchedulerContext.Provider
      value={{
        events,
        selectedEvent,
        setSelectedEvent: onSelectEvent,
        submitEvent,
        deleteEvent,
        displayAddEventModal,
        closeAddEventModal,
      }}
    >
      <div className="p-3 bg-white">
        <header className="mb-3">
          <SchedulerHeader />
        </header>
        <Calendar />
      </div>
      {showAddEventModal && <AddEventModal />}
      {showScreenLoading && <SpinnerModal />}
    </SchedulerContext.Provider>
  );
};

export default SchedulerLayout;
