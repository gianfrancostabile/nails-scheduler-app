import { GoogleAuthProvider, getAuth } from "firebase/auth";
import FirebaseApp from "./FirebaseApp";

const FirebaseAuthentication = getAuth(FirebaseApp);

export default FirebaseAuthentication;
export const GoogleProvider = new GoogleAuthProvider();