import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";
import BottomTab from "./BottomTabNavigator";

const Stack = createStackNavigator();

const MainStack = function () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Bottom Tab"
        component={BottomTab}
        options={{
          headerTitle: "Landing Page",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MainStack;
