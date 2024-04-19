import moment from "moment";
import "moment-timezone";
import "moment/locale/es-mx";
import { useContext } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { SchedulerContext } from "../layouts/SchedulerLayout";
import EventData from "../models/EventData";
import EventCalendar from "../models/EventCalendar";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const { events, setSelectedEvent } = useContext(SchedulerContext);

  const onSelectEvent = (selectedEvent: EventCalendar) => {
    setSelectedEvent(selectedEvent.event_data);
  };

  const mapEvent = (event: EventData): EventCalendar => {
    const hourStart = event.hour.start.split(":");
    const start: Date = event.date.toDate();
    start.setHours(+hourStart[0]);
    start.setMinutes(+hourStart[1]);

    const hourEnd = event.hour.end.split(":");
    const end: Date = event.date.toDate();
    end.setHours(+hourEnd[0]);
    end.setMinutes(+hourEnd[1]);
    return {
      title: event.client_data.name,
      start,
      end,
      event_data: event,
    };
  };

  return (
    <BigCalendar
      localizer={localizer}
      style={{ height: 700 }}
      messages={{
        month: "Mes",
        week: "Semana",
        day: "Dia",
        agenda: "Agenda",
        today: "Hoy",
        previous: "<",
        next: ">",
        noEventsInRange: "No tiene turnos para hoy",
        allDay: "Todo el dia",
        yesterday: "Ayer",
        tomorrow: "Mañana",
        showMore: (number: number) => `+${number} más`,
        date: "Día",
        time: "Horario",
        event: "Turno del cliente",
      }}
      events={[...events.map(mapEvent)]}
      onSelectEvent={onSelectEvent}
    ></BigCalendar>
  );
};

export default Calendar;
