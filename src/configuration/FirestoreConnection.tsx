import { getFirestore } from 'firebase/firestore';
import FirebaseApp from './FirebaseApp';

const firestoreConnection = getFirestore(FirebaseApp);

export default firestoreConnection;
