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
import ProfileList from "../components/ProfileList";
import { getAuth, signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import api from "../helpers/API";

const ProfilePageScreen = function ({ navigation, userProfile }) {
  const [event_data, setEventData] = useState([]);
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

  // Extend EventCard component
  const EventItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Event Details", {
            event_id: item._event_id,
          })
        }
      >
        <EventCard
          title={item._event_title}
          owner={item._creator_id}
          image={item._images._header_image}
        />
      </TouchableOpacity>
    );
  };

  // Extend AnnouncementCard component
  const AnnouncementItem = ({ item }) => {
    return <Text>JOE MAMA</Text>;
  };

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
      {/* Profile list */}
      <ProfileList
        data={userProfile.is_admin ? announcement_data : event_data}
        RenderItem={userProfile.is_admin ? AnnouncementItem : EventItem}
        keyExtractor={(item) =>
          userProfile.is_admin ? item.id : item._event_id
        }
      />
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
