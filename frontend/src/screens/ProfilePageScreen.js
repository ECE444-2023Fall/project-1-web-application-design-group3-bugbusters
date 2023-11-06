import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  FlatList,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import { getAuth, signOut } from "firebase/auth";
import api from "../helpers/API";

const ProfilePageScreen = function ({ userProfile }) {
  const [event_data, setEventData] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    callGetAllEvents = async () => {
      const response = await api.getAllEvents();
      if (response.result == "SUCCESSFUL") {
        setEventData(response.data);
      } else {
        alert("FAILED TO GET ALL EVENTS");
      }
    };

    callGetAllEvents();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const Item = ({ _event_title }) => (
    <View>
      <Text style={{ fontSize: 24 }}>{_event_title}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderBar title="Profile Page" align="center" />
      <View style={styles.profile_picture_container}>
        <Image
          style={styles.profile_picture}
          source={
            userProfile.photo_url
              ? {
                  uri: "https://reactnative.dev/img/tiny_logo.png",
                }
              : {
                  uri: "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
                }
          }
        ></Image>
      </View>
      <View style={styles.display_name_container}>
        <Text style={styles.display_name_text}>{userProfile.display_name}</Text>
      </View>
      <FlatList
        data={event_data}
        renderItem={({ item }) => <Item _event_title={item._event_title} />}
        keyExtractor={(item) => item._event_id}
      />
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>SIGN OUT</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  profile_picture_container: {
    paddingTop: 16,
    paddingBottom: 8,
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

export default ProfilePageScreen;
