import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import LoginWithGoogle from "../components/LoginWithGoogle";
import SpinnerModal from "../components/SpinnerModal";
import { ToastType } from "../components/toast/ToastBuilder";
import FirebaseAuthentication from "../configuration/FirebaseAuthentication";
import HomeLayout from "../layouts/HomeLayout";
import { ToastContext } from "./ToastLayout";

interface UserPropsContext {
  user: User | undefined;
  closeSession: Function;
}

const initialPropsContext: UserPropsContext = {
  user: undefined,
  closeSession: () => {},
};

export const UserContext = createContext(initialPropsContext);

function RootLayout() {
  const { registerToast } = useContext(ToastContext);

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

  const closeSession = () => {
    setLoading(true);
    signOut(FirebaseAuthentication)
      .then(() => {
        registerToast({
          text: "Sesión cerrada con exito",
          type: ToastType.SUCCESS,
        });
      })
      .catch(() => {
        registerToast({
          text: "Hubo un error al cerrar su sesión",
          type: ToastType.ERROR,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <UserContext.Provider value={{ user, closeSession }}>
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
          {/* <Route
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
          /> */}
          <Route
            path="/login"
            element={
              isLoading ? (
                <SpinnerModal />
              ) : user ? (
                <Navigate to="/" />
              ) : (
                <LoginWithGoogle />
              )
            }
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default RootLayout;
