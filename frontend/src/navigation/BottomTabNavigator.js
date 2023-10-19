import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import LandingPageScreen from "../screens/LandingPageScreen";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
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
    </Tab.Navigator>
  );
}
