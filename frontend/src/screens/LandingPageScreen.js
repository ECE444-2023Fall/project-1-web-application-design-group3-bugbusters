import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import HeaderBar from "../components/HeaderBar";
import api from "../helpers/API";

const LandingPageScreen = function () {
  const [text, setText] = useState("");

  const fetchEvents = async () => {
    const response = await api.getAllEvents();
    console.log("response:", response);
    if (response.result == "SUCCESSFUL") {
      console.log("Set something\n");
    }
  };

  return (
    <View>
      <HeaderBar title="Landing Page" align="center" />
      <Text style={{ padding: 20 }}>Hellooo Welcome</Text>
      <Text style={{ padding: 20, paddingTop: 0 }}> What's your name?</Text>
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
      />
      <Text style={{ padding: 20 }}>User Input: {text}</Text>
      <Button title="Fetch" onPress={fetchEvents} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default LandingPageScreen;
