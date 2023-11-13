import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";
import BottomTab from "./BottomTabNavigator";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import CreateEditEventScreen from "../screens/CreateEditEventScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ProfilePageScreen from "../screens/ProfilePageScreen";
import CreateAnnouncementScreen from "../screens/CreateAnnouncementScreen";

const Stack = createStackNavigator();

const MainStack = function () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bottom Tab" component={BottomTab} />
      <Stack.Screen name="Event Details" component={EventDetailsScreen} />
      <Stack.Screen
        name="Create/Edit Event"
        component={CreateEditEventScreen}
      />
      <Stack.Screen
        name="Create Announcement"
        component={CreateAnnouncementScreen}
      />
      <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
      <Stack.Screen name="Profile Page" component={ProfilePageScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MainStack;
