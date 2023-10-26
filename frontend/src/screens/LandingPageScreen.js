import React, { useState, useContext } from "react";
import { Text, StyleSheet, View, TextInput, Button } from "react-native";
import HeaderBar from "../components/HeaderBar";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../store/Action";
import EventCard from "../components/EventCard";

const LandingPageScreen = function () {
  // const [text, setText] = useState("");

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <HeaderBar title="Landing Page" align="center" />
      <EventCard />
      {/* <Text style={{ padding: 20, paddingTop: 0 }}> What's your name?</Text>
      <TextInput
        label="Email"
        placeholder="Your input here..."
        placeholderTextColor="white"
        style={{
          marginHorizontal: 40,
          paddingLeft: 14,
          fontSize: 20,
          backgroundColor: "grey",
          color: "white",
          borderRadius: 20,
        }}
        value={text}
        onChangeText={(text) => {
          setText(text);
        }}
      /> */}
      {/* <Text style={{ padding: 20 }}>User Input: {text}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default LandingPageScreen;
