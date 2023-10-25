import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import LandingPageScreen from "../screens/LandingPageScreen";
import AuthPageScreen from "../screens/AuthPageScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProfilePageScreen from "../screens/ProfilePageScreen";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const auth = getAuth();
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // user is signed in
        navigation.navigate("Landing Page")
      } else {
        // user is signed out
        navigation.navigate("Authentication Page")
      }
    })
    return unsubscribe;
  }, [])

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={(_, color, __) => {
        return {
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: color,
          tabBarStyle: {
            position: "absolute",
            paddingTop: 8,
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
        // TODO: REPLACE LANDINGPAGESCREEN WITH PROFILE
        component={auth.currentUser ? ProfilePageScreen : AuthPageScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcons name="account-circle" size={size + 10} color={color} />
            );
          },
          gestureEnabled: false,
          headerBackground: "blue",
        }}
      />

    </Tab.Navigator>
  );
}
