import { createContext, useContext, useEffect, useState } from "react";
import AddEventModal from "../components/AddEventModal";
import Calendar from "../components/Calendar";
import SchedulerHeader from "../components/SchedulerButtons";
import SpinnerModal from "../components/SpinnerModal";
import ClientData from "../models/client/Client";
import EventData from "../models/event/EventData";
import EventService from "../services/EventService";
import { UserContext } from "./RootLayout";

export interface SchedulerPropsContext {
  events: EventData[];
  clients: ClientData[];
  selectedEvent?: EventData;
  setSelectedEvent: Function;
  submitEvent: Function;
  deleteEvent: Function;
  displayAddEventModal: Function;
  closeAddEventModal: Function;
}

const initialContext: SchedulerPropsContext = {
  events: [],
  clients: [],
  selectedEvent: undefined,
  setSelectedEvent: (event: EventData) => {},
  submitEvent: (event: EventData) => {},
  deleteEvent: (id: string) => {},
  displayAddEventModal: () => {},
  closeAddEventModal: () => {},
};

export const SchedulerContext = createContext(initialContext);

const SchedulerLayout = () => {
  const { user } = useContext(UserContext);

  const [events, setEvents] = useState<EventData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>();
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showScreenLoading, setShowScreenLoading] = useState(true);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  useEffect(() => {
    setShowScreenLoading(true);
    setIsFirstLoading(true);
    findAllEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const findAllEvents = () => {
    EventService.findAll(user?.uid).subscribe((newEvents) => {
      setEvents([...newEvents]);
      setClients([...newEvents.map((event) => event.client_data)]);
      if (isFirstLoading) {
        setShowScreenLoading(false);
        setIsFirstLoading(false);
      }
    });
  };

  const submitEvent = (event: EventData) => {
    try {
      setShowScreenLoading(true);
      if (event.id) {
        EventService.update(event);
      } else {
        EventService.save(event);
      }
    } catch (e) {
    } finally {
      setShowScreenLoading(false);
    }
  };

  const deleteEvent = (id: string) => {
    try {
      setShowScreenLoading(true);
      EventService.remove(id);
    } catch (e) {
    } finally {
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
        clients,
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
