import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import TimePicker from "react-time-picker";
import Datepicker from "tailwind-datepicker-react";
import { SchedulerContext } from "../../layouts/SchedulerLayout";
import { ToastContext } from "../../layouts/ToastLayout";
import EventData from "../../models/EventData";
import { ToastType } from "../toast/ToastBuilder";
import deepEqual from "deep-equal";

interface TimeButton {
  id: string;
  displayText: string;
  minutesToAdd: number;
  isSelected: boolean;
}

const initialStateTimeButtons: TimeButton[] = [
  { id: "30", displayText: "30m", minutesToAdd: 30, isSelected: false },
  { id: "60", displayText: "1h", minutesToAdd: 60, isSelected: false },
  { id: "90", displayText: "1h 30m", minutesToAdd: 90, isSelected: false },
  { id: "120", displayText: "2h", minutesToAdd: 120, isSelected: false },
];
const initialStateEvent: EventData = {
  id: undefined,
  client_data: {
    name: "",
    phone: "",
    email: "",
  },
  date: Timestamp.now(),
  hour: {
    start: "00:00",
    end: "00:00",
  },
};
const PHONE_REGEX = "^(\\+?54)? ?(0)?([1-9])([0-9]{2})? ?([1-9])([0-9]{2}) ?([0-9]{4})$";
const EMAIL_REGEX = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";

const AddEventModal = () => {
  const now = new Date();

  const { selectedEvent, submitEvent, deleteEvent, closeAddEventModal } =
    useContext(SchedulerContext);
  const { registerToast } = useContext(ToastContext);

  const [event, updateEvent] = useState(initialStateEvent);
  const [isEventUpdated, setIsEventUpdated] = useState(true);

  const [timeButtons, setTimeButtons] = useState([...initialStateTimeButtons]);
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    if (selectedEvent && selectedEvent.id) {
      updateEvent(selectedEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setIsEventUpdated(deepEqual(event, selectedEvent));
    }
    syncTimeButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  function syncTimeButtons() {
    const hourStart = convertHourToMoment(event.hour.start);
    const hourEnd = convertHourToMoment(event.hour.end);
    const diffInMinutes = hourEnd?.diff(hourStart, "minutes");
    const updatedButtons = timeButtons.map((button) => {
      const copy = { ...button };
      copy.isSelected = copy.minutesToAdd === diffInMinutes;
      return copy;
    });
    setTimeButtons([...updatedButtons]);
  }

  const addMinutes = (timeButtonSelected: TimeButton) => {
    if (!timeButtonSelected.isSelected) {
      const newHourEnd = moment
        .duration(event.hour.start)
        .add(timeButtonSelected.minutesToAdd, "minutes");
      updateEvent({
        ...event,
        hour: {
          ...event.hour,
          end: `${newHourEnd.hours()}:${newHourEnd.minutes()}`,
        },
      });
    }
  };

  const onChangeName = (value: ChangeEvent<HTMLInputElement>) => {
    updateEvent({
      ...event,
      client_data: {
        ...event.client_data,
        name: value.target.value,
      },
    });
  };

  const onChangePhone = (value: ChangeEvent<HTMLInputElement>) => {
    updateEvent({
      ...event,
      client_data: {
        ...event.client_data,
        phone: value.target.value,
      },
    });
  };

  const onChangeEmail = (value: ChangeEvent<HTMLInputElement>) => {
    updateEvent({
      ...event,
      client_data: {
        ...event.client_data,
        email: value.target.value,
      },
    });
  };

  const onChangeHourStart = (value: any) => {
    if (value) {
      updateEvent({
        ...event,
        hour: {
          ...event.hour,
          start: value.toString(),
        },
      });
    }
  };

  const onChangeDate = (value: Date) => {
    updateEvent({
      ...event,
      date: Timestamp.fromDate(value),
    });
  };

  const submitForm = async () => {
    if (validateFormData()) {
      await submitEvent(event);
      if (event.id) {
        registerToast({
          text: "El turno fue actualizado",
          type: ToastType.SUCCESS,
        });
      } else {
        registerToast({
          text: "Nuevo turno agendado",
          type: ToastType.SUCCESS,
        });
      }
      closeModal();
    }
  };

  const onDeleteEvent = async (id?: string) => {
    await deleteEvent(id);
    registerToast({
      text: "El turno fue eliminado",
      type: ToastType.SUCCESS,
    });
    closeModal();
  };

  const closeModal = () => {
    setTimeButtons([...initialStateTimeButtons]);
    closeAddEventModal();
  };

  const convertHourToMoment = (hour: string): moment.Moment | null => {
    if (!hour) {
      return null;
    }
    const [hours, minutes] = hour.split(":").map(Number);
    return moment().set({ hours: hours, minutes: minutes, seconds: 0 });
  };

  const validateFormData = (): boolean => {
    if (!event.client_data.name) {
      registerToast({
        text: "El nombre del cliente es requerido",
        type: ToastType.ERROR,
      });
      return false;
    }
    if (event.client_data.phone && !event.client_data.phone.match(PHONE_REGEX)) {
      registerToast({
        text: "El formato del teléfono es incorrecto",
        type: ToastType.ERROR,
      });
      return false;
    }
    if (event.client_data.email && !event.client_data.email.match(EMAIL_REGEX)) {
      registerToast({
        text: "El formato del email es incorrecto",
        type: ToastType.ERROR,
      });
      return false;
    }
    if (!event.date) {
      registerToast({
        text: "El dia del turno es requerido",
        type: ToastType.ERROR,
      });
      return false;
    }
    const hourStart = convertHourToMoment(event.hour.start);
    if (!hourStart) {
      registerToast({
        text: "La hora desde es requerida",
        type: ToastType.ERROR,
      });
      return false;
    }
    const hourEnd = convertHourToMoment(event.hour.end);
    if (!hourEnd) {
      registerToast({
        text: "La hora hasta es requerida",
        type: ToastType.ERROR,
      });
      return false;
    }
    if (hourEnd.isBefore(hourStart)) {
      registerToast({
        text: "La hora hasta debe superar la hora desde",
        type: ToastType.ERROR,
      });
      return false;
    }
    return true;
  };

  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="bg-black bg-opacity-20 overflow-y-hidden overflow-x-hidden fixed flex top-0 left-0 z-40 justify-center items-start size-full md:inset-0"
      onClick={() => closeModal()}
    >
      <div className="p-4">
        <div
          className="rounded-lg bg-white shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex items-center justify-between p-2 md:p-3 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {event.id ? "Modificar turno" : "Agendar nuevo turno"}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              data-modal-hide="default-modal"
              onClick={() => closeModal()}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </header>
          <div className="p-2 md:p-3 space-y-0 flex flex-col">
            <label
              htmlFor="clientName"
              className="flex flex-col bg-white border border-gray-300 text-gray-900 text-sm rounded-tl-lg rounded-tr-lg p-2.5 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
            >
              <span>Nombre del cliente *</span>
              <input
                id="clientName"
                name="clientName"
                type="text"
                className="outline-none"
                placeholder="Juan Perez"
                autoFocus={true}
                value={event.client_data.name}
                maxLength={50}
                onChange={onChangeName}
              />
            </label>
            <label
              htmlFor="phoneNumber"
              className="flex flex-col bg-white border border-t-0 border-gray-300 text-gray-900 text-sm p-2.5 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
            >
              <span>Teléfono</span>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                className="outline-none"
                placeholder="22350000"
                value={event.client_data.phone}
                onChange={onChangePhone}
              />
            </label>
            <label
              htmlFor="email"
              className="flex flex-col bg-white border border-t-0 border-gray-300 text-gray-900 text-sm p-2.5 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
            >
              <span>Email</span>
              <input
                id="email"
                name="email"
                type="email"
                className="outline-none"
                placeholder="email@gmail.com"
                value={event.client_data.email}
                onChange={onChangeEmail}
              />
            </label>
            <label
              htmlFor="day"
              className="p-2.5 flex flex-col bg-white border border-t-0 border-gray-300 text-gray-900 text-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
            >
              <span>Dia del turno *</span>
              <Datepicker
                options={{
                  autoHide: true,
                  clearBtn: false,
                  todayBtn: false,
                  defaultDate: now,
                  language: "es",
                  weekDays: ["L", "M", "X", "J", "V", "S", "D"],
                  inputPlaceholderProp: `${now.getDate()}/${
                    now.getMonth() + 1
                  }/${now.getFullYear()}`,
                  theme: {
                    background: "",
                    clearBtn: "",
                    disabledText: "text-gray-300",
                    icons: "",
                    input: "border-0 bg-transparent py-0 pl-6",
                    inputIcon: "-ml-3",
                    selected: "hover:bg-blue-700",
                    text: "",
                    todayBtn: "",
                  },
                  inputDateFormatProp: {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  },
                }}
                value={event.date.toDate()}
                show={showDate}
                setShow={setShowDate}
                onChange={onChangeDate}
              />
            </label>
            <span className="p-2.5 flex flex-col bg-white border border-t-0 border-gray-300 text-gray-900 text-sm rounded-bl-lg rounded-br-lg focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
              <div className="flex flex-row w-full">
                <div className="flex flex-col w-full">
                  <span>Hora de inicio *</span>
                  <TimePicker
                    onChange={onChangeHourStart}
                    value={event.hour.start}
                    clearIcon={false}
                    disableClock={true}
                    className={"flex-grow-1"}
                  />
                </div>
                <div className="flex flex-col w-full justify-end text-right">
                  <span>Hora de fin</span>
                  <TimePicker
                    value={event.hour.end}
                    clearIcon={false}
                    disableClock={true}
                    className={"-mr-4"}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="flex flex-row items-center space-x-1 w-full pt-3">
                {timeButtons.map((button) => (
                  <button
                    id={`button-${button.id}`}
                    data-modal-hide="default-modal"
                    type="button"
                    className={`py-2.5 px-5 font-medium text-gray-900 focus:outline-none rounded-lg border w-20 hour-button sm:text-sm sm:w-24 ${
                      button.isSelected
                        ? "bg-blue-500 hover:bg-blue-600 border-blue-600 ring-transparent text-white font-bold"
                        : "bg-white hover:bg-gray-100 border-gray-300 focus:ring-4 focus:ring-gray-100"
                    }`}
                    onClick={() => addMinutes(button)}
                  >
                    {button.displayText}
                  </button>
                ))}
              </div>
            </span>
          </div>
          {event.id ? (
            <footer className="flex items-center justify-evenly p-2 md:p-3 border-t border-gray-200 rounded-b">
              <button
                data-modal-hide="default-modal"
                type="button"
                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center flex-grow-0"
                onClick={() => onDeleteEvent(event.id)}
              >
                <svg
                  className="w-5 h-5 text-white-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                  />
                </svg>
              </button>
              <div className="flex items-center justify-end flex-grow">
                <button
                  data-modal-hide="default-modal"
                  type="button"
                  className="text-white bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:cursor-not-allowed disabled:bg-gray-200 disabled:hover:bg-gray-200"
                  onClick={submitForm}
                  disabled={isEventUpdated}
                >
                  Modificar
                </button>
                <button
                  data-modal-hide="default-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100"
                  onClick={() => closeModal()}
                >
                  Cancelar
                </button>
              </div>
            </footer>
          ) : (
            <footer className="flex items-center justify-end p-2 md:p-3 border-t border-gray-200 rounded-b">
              <button
                data-modal-hide="default-modal"
                type="button"
                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={submitForm}
              >
                Crear
              </button>
              <button
                data-modal-hide="default-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100"
                onClick={() => closeModal()}
              >
                Cancelar
              </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
