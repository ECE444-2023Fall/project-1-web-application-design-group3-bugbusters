import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useReducer, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import LandingPageScreen from "../screens/LandingPageScreen";

const Stack = createStackNavigator();

const MainStack = function () {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Landing Page" component={LandingPageScreen}/>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MainStack;
