import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import LandingPageScreen from "../screens/LandingPageScreen";
import AuthPageScreen from "../screens/AuthPageScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProfilePageScreen from "../screens/ProfilePageScreen";

const Tab = createBottomTabNavigator();

export default function BottomTab({ navigation }) {
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // user is signed in
        navigation.navigate("Landing Page");
      } else {
        // user is signed out
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
          tabBarActiveTintColor: contrastColor,
          tabBarInactiveTintColor: color,
          tabBarStyle: {
            position: "absolute",
            paddingTop: 8,
            backgroundColor: primaryColor,
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
