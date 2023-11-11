import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderBar from "../components/HeaderBar";
import { Ionicons } from "@expo/vector-icons";

const EditProfileScreen = function ({ navigation, route }) {
  const { userProfile } = route.params;
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderBar
        title="Edit Profile"
        childrenLeft={
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={26} color={contrastColor} />
          </TouchableOpacity>
        }
        childrenRight={<View style={{ width: 26 }} />}
      />
      {/* Profile picture container */}
      <View style={styles.profile_picture_container}>
        <Image
          style={styles.profile_picture}
          source={{
            uri: userProfile.photo_url
              ? "https://reactnative.dev/img/tiny_logo.png"
              : "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
          }}
        ></Image>
      </View>
      {/* Display name container */}
      <View style={styles.display_name_container}>
        <Text style={styles.display_name_text}>{userProfile.display_name}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  profile_picture_container: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  profile_picture: {
    width: 80,
    height: 80,
    resizeMode: "stretch",
    borderColor: "#1E3765",
    borderWidth: 3,
    borderRadius: 20,
  },
  display_name_container: {
    paddingBottom: 16,
  },
  display_name_text: {
    fontWeight: 700,
    fontSize: 24,
  },
});

export default EditProfileScreen;
