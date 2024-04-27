import { FirebaseOptions, initializeApp } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCZKhiIsMbwYUDSyvFJST33ex52gjZu9rI",
  authDomain: "nails-scheduling.firebaseapp.com",
  databaseURL: "https://nails-scheduling-default-rtdb.firebaseio.com",
  projectId: "nails-scheduling",
  storageBucket: "nails-scheduling.appspot.com",
  messagingSenderId: "325877127092",
  appId: "1:325877127092:web:9a81f24062823b8a6104e1",
  measurementId: "G-TLSR5K8ZZH",
};

const FirebaseApp = initializeApp(firebaseConfig);

export default FirebaseApp;
