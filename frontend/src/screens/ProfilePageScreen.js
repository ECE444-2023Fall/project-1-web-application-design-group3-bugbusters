import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import HeaderBar from "../components/HeaderBar";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useSelector } from "react-redux";

const ProfilePageScreen = function () {
  const [text, setText] = useState("");
  const [displayName, setDisplayName] = useState("");
  // read from redux store
  const userProfileSelector = useSelector((state) => {
    return state.main.userData
  })

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setDisplayName(user.displayName)
    } else {
      setDisplayName("")
    }
  });

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }

  return (
    <View>
      <HeaderBar title="Profile Page" align="center" />
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
      <Text style={{ padding: 20, fontSize: 24 }}>USER INPUT: {text}</Text>
      <Text style={{ padding: 20, fontSize: 24 }}>Username: {userProfileSelector.data?.display_name}</Text>
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

export default ProfilePageScreen;
