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
import HorizontalTextBuffer from "../components/HorizontalTextBuffer";

const ProfilePageScreen = function ({ userProfile }) {
  const [event_data, setEventData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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

  const Item = ({ event_title }) => (
    <View style={{ marginVertical: 42 }}>
      <Text style={{ fontSize: 24 }}>{event_title}</Text>
    </View>
  );

  const ListHeaderComponent = ({ item_types }) => (
    <View
      style={{
        backgroundColor: "white",
        paddingLeft: 20,
        paddingVertical: 8,
        borderTopColor: "#1E3765",
        borderBottomColor: "#1E3765",
        borderTopWidth: 2,
        borderBottomWidth: 2,
      }}
    >
      <Text
        style={{
          fontSize: 20,
        }}
      >
        {item_types}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderBar title="Profile Page" align="center" />
      <View style={styles.profile_picture_container}>
        <Image
          style={styles.profile_picture}
          source={
            userProfile?.photo_url
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
        <Text style={styles.display_name_text}>
          {userProfile?.display_name}
        </Text>
      </View>
      <View style={{ width: "100%", flex: 1 }}>
        <FlatList
          data={event_data}
          renderItem={({ item }) => <Item event_title={item._event_title} />}
          keyExtractor={(item) => item._event_id}
          onRefresh={() => {
            // simulate fetching more events
            setRefreshing(true);
            setTimeout(() => {
              // call getEvent(event_id) here
              setRefreshing(false);
            }, 2000);
          }}
          refreshing={refreshing}
          ListHeaderComponent={<ListHeaderComponent item_types={"EVENTS"} />}
          stickyHeaderIndices={[0]}
        />
      </View>
      {/*TODO: PLACE SIGN OUT BUTTON IN <Modal/>*/}
      <TouchableOpacity onPress={handleSignOut} style={{ flex: 0.25 }}>
        <Text style={styles.buttonText}>SIGN OUT</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
