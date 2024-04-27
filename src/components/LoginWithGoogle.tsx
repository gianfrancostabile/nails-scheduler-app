import { deleteUser, signInWithPopup, signOut } from "firebase/auth";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import FirebaseAuthentication, {
  GoogleProvider,
} from "../configuration/FirebaseAuthentication";
import { ToastContext } from "../layouts/ToastLayout";
import WhitelistService from "../services/WhitelistService";
import SpinnerModal from "./SpinnerModal";
import { ToastType } from "./toast/ToastBuilder";

const LoginWithGoogle = () => {
  const { registerToast } = useContext(ToastContext);

  const [showScreenLoading, setShowScreenLoading] = useState(false);

  const navigate = useNavigate();

  const submitForm = async () => {
    setShowScreenLoading(true);
    try {
      await signInWithPopup(FirebaseAuthentication, GoogleProvider)
        .then(async (googleAuth) => {
          const email = googleAuth.user.email || "";
          const whitelist = await WhitelistService.findAll();
          if (whitelist.includes(email)) {
            registerToast({
              text: "Sesión iniciada",
              type: ToastType.SUCCESS,
            });
            navigate("/");
          } else {
            signOut(FirebaseAuthentication);
            deleteUser(googleAuth.user);
            registerToast({
              text: "Acceso denegado",
              type: ToastType.ERROR,
            });
          }
        })
        .finally(() => setShowScreenLoading(false));
    } catch (e) {
      registerToast({
        text: "Hubo un error al iniciar sesión con Google",
        type: ToastType.ERROR,
      });
      setShowScreenLoading(false)
    }
  };

  return (
    <div className="overflow-y-hidden overflow-x-hidden flex justify-center items-center size-full h-screen md:inset-0">
      <div className="rounded-lg bg-white shadow w-full sm:w-8/12 m-4 sm:p-0 md:w-5/12 lg:w-2/12">
        <header className="flex items-center justify-between p-2 md:p-3 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">
            Iniciá sesión con tu cuenta de Google
          </h3>
        </header>
        <footer className="flex items-center justify-center p-2 md:p-3 border-gray-200 rounded-b">
          <button
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={submitForm}
          >
            Iniciar Sesión
          </button>
        </footer>
      </div>
      {showScreenLoading && <SpinnerModal />}
    </div>
  );
};

export default LoginWithGoogle;
