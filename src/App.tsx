import { BrowserRouter as Router } from "react-router-dom";
import SchedulerLayout from "./layouts/SchedulerLayout";
import ToastLayout from "./layouts/ToastLayout";

function App() {
  return (
    <Router>
      <div className="lg:mt-3 mx-2 2xl:mx-36 lg:mx-20 md:mx-8 sm:mx-4">
        <ToastLayout>
          <SchedulerLayout />
        </ToastLayout>
      </div>
    </Router>
  );
}

export default App;
