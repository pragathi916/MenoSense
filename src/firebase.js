import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgo432VGwUMsXWsdl214TjKo7CEWV8brE",
  authDomain: "menosense-f185d.firebaseapp.com",
  projectId: "menosense-f185d",
  storageBucket: "menosense-f185d.firebasestorage.app",
  messagingSenderId: "814917505078",
  appId: "1:814917505078:web:0f0a1231ece058b6510897",
  measurementId: "G-Y0RHS1L6Z9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    // Save or update user in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      firstName: user.displayName?.split(" ")[0] || "",
      lastName: user.displayName?.split(" ")[1] || "",
      img: user.photoURL || "",
    }, { merge: true });

    console.log("Google user logged in & saved to Firestore");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export { app, auth, db, signInWithGoogle, logout };
