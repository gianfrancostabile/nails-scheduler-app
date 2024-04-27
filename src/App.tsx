import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import HomeLayout from "./layouts/HomeLayout";
import ToastLayout from "./layouts/ToastLayout";
import { createContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import FirebaseAuthentication from "./configuration/FirebaseAuthentication";

interface UserPropsContext {
  user: User | undefined;
}

const initialPropsContext: UserPropsContext = {
  user: undefined,
};

export const UserContext = createContext(initialPropsContext);

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    onAuthStateChanged(FirebaseAuthentication, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      <ToastLayout>
        <Router>
          <Routes>
            <Route
              path="/"
              element={user ? <HomeLayout /> : <Navigate to="/login" />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </ToastLayout>
    </UserContext.Provider>
  );
}

export default App;
