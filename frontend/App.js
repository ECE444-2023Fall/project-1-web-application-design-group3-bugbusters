import { NavigationContainer } from "@react-navigation/native";
import { store } from "./src/store/Store";
import { Provider } from "react-redux";
import MainStack from "./src/navigation/StackNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </Provider>
  );
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnK_EgAoRtEyaSWbq_uhvc-rCVQjBzqz4",
  authDomain: "ece444bulletin.firebaseapp.com",
  projectId: "ece444bulletin",
  storageBucket: "ece444bulletin.appspot.com",
  messagingSenderId: "1000140561380",
  appId: "1:1000140561380:web:a35263774a0ded3ca345f1",
  // measurementId: "G-3V4BS6SWNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
