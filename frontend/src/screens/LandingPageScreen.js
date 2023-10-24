import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import HeaderBar from "../components/HeaderBar";
import { getAuth, signOut } from "firebase/auth";

const LandingPageScreen = function () {
  const [text, setText] = useState("");

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("SIGNED OUT")
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }

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
      <TouchableOpacity
          onPress={handleSignOut}
          style={styles.button}
      >
          <Text style={styles.buttonText}>SIGN OUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default LandingPageScreen;
