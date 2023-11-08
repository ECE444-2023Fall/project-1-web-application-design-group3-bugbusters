import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";
import BottomTab from "./BottomTabNavigator";
import EventDetailsScreen from "../screens/EventDetailsScreen";

const Stack = createStackNavigator();

const MainStack = function () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bottom Tab" component={BottomTab} />
      <Stack.Screen name="Event Details" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MainStack;
