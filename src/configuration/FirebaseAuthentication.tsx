import { getAuth } from "firebase/auth";
import FirebaseApp from "./FirebaseApp";

const FirebaseAuthentication = getAuth(FirebaseApp);

export default FirebaseAuthentication;