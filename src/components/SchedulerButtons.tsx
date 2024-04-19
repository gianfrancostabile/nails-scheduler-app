import React, { useContext } from "react";
import { SchedulerContext } from "../layouts/SchedulerLayout";

const SchedulerHeader = () => {
  const { displayAddEventModal } = useContext(SchedulerContext);
  return (
    <div className="flex justify-end">
      <button
        className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        onClick={() => displayAddEventModal()}
      >
        Agendar turno
      </button>
    </div>
  );
};

export default SchedulerHeader;
