import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import LandingPageScreen from "../screens/LandingPageScreen";
import AuthPageScreen from "../screens/AuthPageScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProfilePageScreen from "../screens/ProfilePageScreen";
import api from "../helpers/API";
import { useDispatch } from "react-redux";
import { SETUSERPROFILEDATA, RESET } from "../store/ActionType";

const Tab = createBottomTabNavigator();

export default function BottomTab({ navigation }) {
  const auth = getAuth();
  // redux for user profile data
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // user is signed in
        // get UserProfile and store in redux
        api.getUserProfile(user.uid).then((userProfile) => {
          dispatch({ type: SETUSERPROFILEDATA, payload: userProfile });
        });
        navigation.navigate("Landing Page");
      } else {
        // user is signed out
        // reset store
        dispatch({ type: RESET });
        navigation.navigate("Landing Page");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={(_, color, __) => {
        return {
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: color,
          tabBarStyle: {
            position: "absolute",
            justifyContent: "center",
            padding: 8,
            backgroundColor: "#1E3765",
          },
          headerShown: false,
          tabBarShowLabel: false,
        };
      }}
    >
      <Tab.Screen
        name="Landing Page"
        component={LandingPageScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcons name="event" size={size + 10} color={color} />
            );
          },
          gestureEnabled: false,
          headerBackground: "blue",
        }}
      />
      <Tab.Screen
        name="Authentication Page"
        component={auth.currentUser ? ProfilePageScreen : AuthPageScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcons
                name="account-circle"
                size={size + 10}
                color={color}
              />
            );
          },
          gestureEnabled: false,
          headerBackground: "blue",
        }}
      />
    </Tab.Navigator>
  );
}
