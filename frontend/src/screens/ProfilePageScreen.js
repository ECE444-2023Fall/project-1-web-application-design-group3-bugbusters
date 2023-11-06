import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  FlatList,
} from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import HeaderBar from "../components/HeaderBar";
import EventCard from "../components/EventCard";
import PopUp from "../components/PopUp";
import { getAuth, signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import api from "../helpers/API";

const ProfilePageScreen = function ({ navigation, userProfile }) {
  const [event_data, setEventData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [menuPopup, setMenuPopup] = useState(false);
  const auth = getAuth();

  const primaryColor = useSelector((state) => state.main.primaryColor);

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

  const Item = ({ event }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Event Details", {
            event_id: event._event_id,
          })
        }
      >
        <EventCard
          title={event._event_title}
          owner={event._creator_id}
          image={event._images._header_image}
        />
      </TouchableOpacity>
    );
  };

  const EmptyItem = () => (
    <View style={styles.list_item_container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.list_item_text}>No events</Text>
      </TouchableOpacity>
    </View>
  );

  const ListHeaderComponent = ({ item_types }) => (
    <View style={styles.list_header_component_container}>
      <Text style={styles.list_header_component_text}>{item_types}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderBar title="Profile Page" align="center" />
      {/* Profile picture container */}
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
        {/* Menu button */}
        <TouchableOpacity
          style={styles.menu_button}
          onPress={() => {
            setMenuPopup(true);
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={28} color={primaryColor} />
        </TouchableOpacity>
        <PopUp visible={menuPopup} setVisible={setMenuPopup}>
          <TouchableOpacity onPress={handleSignOut} style={styles.menu_item}>
            <Octicons name="sign-out" size={20} color={primaryColor} />
            <Text style={{ color: primaryColor }}>SIGN OUT</Text>
          </TouchableOpacity>
        </PopUp>
      </View>
      {/* Display name container */}
      <View style={styles.display_name_container}>
        <Text style={styles.display_name_text}>
          {userProfile?.display_name}
        </Text>
      </View>
      {/* EventCard list */}
      <View style={{ width: "100%", flex: 1 }}>
        <FlatList
          data={event_data}
          renderItem={({ item }) => <Item event={item} />}
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
          ListHeaderComponent={<ListHeaderComponent item_types={"Events"} />}
          ListEmptyComponent={<EmptyItem />}
          stickyHeaderIndices={[0]}
        />
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
  menu_button: {
    position: "absolute",
    start: "90%",
  },
  display_name_container: {
    paddingBottom: 16,
  },
  display_name_text: {
    fontWeight: 700,
    fontSize: 24,
  },
  list_header_component_container: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingVertical: 8,
    borderTopColor: "#1E3765",
    borderBottomColor: "#1E3765",
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  list_header_component_text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  list_item_container: {
    marginTop: 42,
    marginHorizontal: 32,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 24,
  },
  list_item_text: {
    fontSize: 24,
  },
  button: {
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    paddingVertical: 80,
  },
  menu_item: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 24,
    paddingVertical: 12,
    gap: 24,
  },
});

export default ProfilePageScreen;
