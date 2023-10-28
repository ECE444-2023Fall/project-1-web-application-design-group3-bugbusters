import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import LandingPageScreen from "../screens/LandingPageScreen";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

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
    </Tab.Navigator>
  );
}
