import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import SpinnerModal from "./components/SpinnerModal";
import FirebaseAuthentication from "./configuration/FirebaseAuthentication";
import HomeLayout from "./layouts/HomeLayout";
import ToastLayout from "./layouts/ToastLayout";

interface UserPropsContext {
  user: User | undefined;
}

const initialPropsContext: UserPropsContext = {
  user: undefined,
};

export const UserContext = createContext(initialPropsContext);

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(FirebaseAuthentication, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
      setLoading(false);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      <ToastLayout>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                isLoading ? (
                  <SpinnerModal />
                ) : user ? (
                  <HomeLayout />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/register"
              element={
                isLoading ? (
                  <SpinnerModal />
                ) : user ? (
                  <Navigate to="/" />
                ) : (
                  <Register />
                )
              }
            />
            <Route
              path="/login"
              element={
                isLoading ? (
                  <SpinnerModal />
                ) : user ? (
                  <Navigate to="/" />
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ToastLayout>
    </UserContext.Provider>
  );
}

export default App;
