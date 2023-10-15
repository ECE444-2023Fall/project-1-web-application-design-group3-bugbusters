import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import HeaderBar from "../components/HeaderBar";

const LandingPageScreen = function () {
  return (
    <View>
      <HeaderBar title="Landing Page" align="center" />
      <Text>Hellooo Welcome</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default LandingPageScreen;
