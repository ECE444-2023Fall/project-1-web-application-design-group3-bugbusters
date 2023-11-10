import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import LandingPageScreen from "../screens/LandingPageScreen";
import AuthPageScreen from "../screens/AuthPageScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProfilePageScreen from "../screens/ProfilePageScreen";
import api from "../helpers/API";
import CreateEditEventScreen from "../screens/CreateEditEventScreen";
import { reset, setUserProfileData } from "../store/Action";
import CreateAnnouncementScreen from "../screens/CreateAnnouncementScreen";

const Tab = createBottomTabNavigator();

export default function BottomTab({ navigation }) {
  const auth = getAuth();
  // redux for user profile data
  const dispatchRedux = useDispatch();
  // read current user profile from redux store
  const userProfileSelector = useSelector((state) => {
    return state.main.userProfileData;
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
      } else {
        // user is signed out
        // reset store
        dispatchRedux(reset());
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Landing Page"
      screenOptions={(_, color, __) => {
        return {
          tabBarActiveTintColor: contrastColor,
          tabBarActiveTintColor: contrastColor,
          tabBarInactiveTintColor: color,
          tabBarStyle: {
            position: "absolute",
            justifyContent: "center",
            backgroundColor: primaryColor,
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
        }}
      />
      <Tab.Screen
        name="Create Edit"
        // navigation logic
        getComponent={() => {
          if (auth.currentUser) {
            return userProfileSelector.data?.is_admin
              ? // TODO: show CreateAnnouncementScreen
                CreateAnnouncementScreen
              : CreateEditEventScreen;
          } else {
            return AuthPageScreen;
          }
        }}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcons name="add-box" size={size + 10} color={color} />
            );
          },
          gestureEnabled: false,
        }}
      />
      <Tab.Screen
        name="Authentication Page"
        component={
          auth.currentUser
            ? () => (
                <ProfilePageScreen
                  navigation={navigation}
                  userProfile={userProfileSelector.data}
                />
              )
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
