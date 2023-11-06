import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import LandingPageScreen from "../screens/LandingPageScreen";
import AuthPageScreen from "../screens/AuthPageScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProfilePageScreen from "../screens/ProfilePageScreen";
import api from "../helpers/API";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfileData, reset } from "../store/Action";

const Tab = createBottomTabNavigator();

export default function BottomTab({ navigation }) {
  const auth = getAuth();
  // redux for user profile data
  const dispatchRedux = useDispatch();
  // read current user profile from redux store
  const userProfileSelector = useSelector((state) => {
    return state.main.userData;
  });
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // user is signed in
        // get UserProfile and store in redux
        api.getUserProfile(user.uid).then((userProfile) => {
          dispatchRedux(setUserProfileData(userProfile));
        });
        navigation.navigate("Landing Page");
      } else {
        // user is signed out
        // reset store
        dispatchRedux(reset());
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
            justifyContent: "center",
            padding: 8,
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
        component={
          auth.currentUser
            ? () => <ProfilePageScreen userProfile={userProfileSelector.data} />
            : AuthPageScreen
        }
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
