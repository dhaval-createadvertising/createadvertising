import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

export const useFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyB39JAtEwDkpTyN9tH8pHWLAruXkFDi-uI",
    authDomain: "create-advertising.firebaseapp.com",
    projectId: "create-advertising",
    storageBucket: "create-advertising.firebasestorage.app",
    messagingSenderId: "745406850988",
    appId: "1:745406850988:web:dba6fed42cf0303f43fc09"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const auth = getAuth(app);

  return {
    app,
    auth
  };
};

export const useAuth = () => {
  const { auth } = useFirebase();
  const user = useState<User | null>("user", () => null);
  const loading = useState("auth-loading", () => true);

  // Initialize auth listener
  if (import.meta.client) {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
      loading.value = false;
    });
  }

  return {
    user,
    loading,
    isAuthenticated: computed(() => !!user.value),
    logout: () => auth.signOut()
  };
};
