import { signInWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import FirebaseAuthentication from "../configuration/FirebaseAuthentication";
import { ToastContext } from "../layouts/ToastLayout";
import { EMAIL_REGEX } from "../utils/Constants";
import SpinnerModal from "./SpinnerModal";
import { ToastType } from "./toast/ToastBuilder";
import DefaultInput from "./util/DefaultInput";

const Login = () => {
  const { registerToast } = useContext(ToastContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showScreenLoading, setShowScreenLoading] = useState(false);

  const navigate = useNavigate();

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.preventDefault();
		setShowScreenLoading(true);
    if (validateFields()) {
      await signInWithEmailAndPassword(FirebaseAuthentication, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          setShowScreenLoading(false);
          registerToast({
            text: "Sesión iniciada",
            type: ToastType.SUCCESS,
          });
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          setShowScreenLoading(false);
          registerToast({
            text: "Verifique que sus credenciales son correctas",
            type: ToastType.ERROR,
          });
        });
    } else {
			setShowScreenLoading(false);
		}
  };

  const validateFields = () => {
    if (!email) {
      registerToast({
        text: "El mail tiene que ser ingresado",
        type: ToastType.ERROR,
      });
      return false;
    }
    if (!email.match(EMAIL_REGEX)) {
      registerToast({
        text: "El formato del email es incorrecto",
        type: ToastType.ERROR,
      });
      return false;
    }
    if (!password) {
      registerToast({
        text: "La contraseña tiene que ser ingresada",
        type: ToastType.ERROR,
      });
      return false;
    }
    if (password.length < 7) {
      registerToast({
        text: "La contraseña debe tener mínimo 7 caracteres",
        type: ToastType.ERROR,
      });
      return false;
    }
    if (password.length > 30) {
      registerToast({
        text: "La contraseña debe tener máximo 30 caracteres",
        type: ToastType.ERROR,
      });
      return false;
    }
    return true;
  };

  return (
    <div className="overflow-y-hidden overflow-x-hidden flex justify-center items-center size-full h-screen md:inset-0">
      <form className="rounded-lg bg-white shadow w-full sm:w-8/12 m-4 sm:p-0 md:w-5/12 lg:w-4/12">
        <header className="flex items-center justify-between p-2 md:p-3 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">
            Iniciá sesión con tu cuenta
          </h3>
        </header>
        <div className="p-2 md:p-3 space-y-0 flex flex-col">
          <DefaultInput
            id="email"
            fieldName="Email"
            type="email"
            placeholder="email@gmail.com"
            fieldValue={email}
            onChange={onChangeEmail}
            autofocus={true}
            isFirst={true}
          />
          <DefaultInput
            id="password"
            fieldName="Contraseña"
            placeholder="Contraseña"
            type="password"
            fieldValue={password}
            onChange={onChangePassword}
            isLast={true}
          />
        </div>
        <footer className="flex items-center justify-between p-2 md:p-3 border-t border-gray-200 rounded-b">
          <NavLink
            to="/register"
            className="text-sky-500 hover:text-sky-600 focus:outline-none font-medium text-sm py-2.5 text-center"
          >
            No tienes cuenta?
          </NavLink>
          <button
            type="submit"
            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={submitForm}
          >
            Iniciar Sesión
          </button>
        </footer>
      </form>
      {showScreenLoading && <SpinnerModal />}
    </div>
  );
};

export default Login;
