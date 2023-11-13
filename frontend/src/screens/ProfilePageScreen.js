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
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import HeaderBar from "../components/HeaderBar";
import EventCard from "../components/EventCard";
import PopUp from "../components/PopUp";
import ProfileList from "../components/ProfileList";
import { getAuth, signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import api from "../helpers/API";
import AnnouncementCard from "../components/AnnouncementCard";
import HorizontalTextBuffer from "../components/HorizontalTextBuffer";

const ProfilePageScreen = function ({
  navigation,
  route,
  showBackArrowProp,
  userProfileProp,
}) {
  // following is required because this screen can be navigated to via Stack.Screen
  // or via BottomTabNavigator
  const userProfile = route?.params.userProfile
    ? route?.params?.userProfile
    : userProfileProp;
  const showBackArrow = route?.params.showBackArrow
    ? route?.params.showBackArrow
    : showBackArrowProp;
  const [event_data, setEventData] = useState([]);
  const [announcement_data, setAnnouncementData] = useState([]);
  const [menuPopup, setMenuPopup] = useState(false);
  const auth = getAuth();
  const showAnnouncements =
    userProfile?.is_admin && userProfile?.uid == auth.currentUser?.uid;

  const primaryColor = useSelector((state) => state.main.primaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  useEffect(() => {
    callGetUserEvents = async () => {
      const response = await api.search({
        events_by_profile: userProfile?.uid,
      });
      if (response.result == "SUCCESSFUL") {
        setEventData(response.data.results);
      } else {
        alert("FAILED TO GET ALL EVENTS");
      }
    };

    callGetAllAnnouncements = async () => {
      const response = await api.getAllAnnouncements();
      if (response.result == "SUCCESSFUL") {
        setAnnouncementData(response.data);
      } else {
        alert("FAILED TO GET ALL ANNOUNCEMENTS");
      }
    };

    if (userProfile?.is_admin) {
      callGetAllAnnouncements();
    } else {
      callGetUserEvents();
    }
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigation.navigate("Landing Page");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const handleEditProfile = () => {
    setMenuPopup(false);
    navigation.navigate("Edit Profile", { userProfile: userProfile });
  };

  // delete callback for announcements
  announcement_deleter = ({ id }) => {
    api.deleteAnnouncement(id);
    const filteredData = announcement_data.filter((item) => item.id !== id);
    setAnnouncementData(filteredData);
    console.log("DELETED", id);
  };

  // edit callback for announcements
  announcement_editer = ({ text, id, textSetter, popupSetter }) => {
    api
      .editAnnouncement({ description: text, id: id })
      .then((response) => {
        if (response.result == "SUCCESSFUL") {
          textSetter(text);
          popupSetter(false);
        } else {
          // show UI that it didn't work
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // delete callback for events
  deleteEventById = (id) => {
    const filteredData = event_data.filter((item) => item.event_ID !== id);
    setEventData(filteredData);
  };

  // Extend EventCard component
  const EventItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Event Details", {
            event_id: item.event_ID,
          })
        }
      >
        <EventCard
          title={item.event_title}
          owner={item.friendly_creator_name}
          image={
            item.header_image_URL
              ? item.header_image_URL
              : "https://picsum.photos/200"
          }
          id={item.event_ID}
        />
      </TouchableOpacity>
    );
  };

  // Extend AnnouncementCard component
  const AnnouncementItem = ({ item, editer, deleter }) => {
    return (
      <AnnouncementCard
        announcement_data={item}
        editer={editer}
        deleter={deleter}
      />
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderBar
        title="Profile Page"
        align={showBackArrow ? null : "center"}
        childrenLeft={
          showBackArrow ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="arrow-back" size={30} color={contrastColor} />
            </TouchableOpacity>
          ) : null
        }
        childrenRight={
          showBackArrow ? <View style={{ marginRight: 30 }} /> : null
        }
      />
      {/* Profile picture container */}
      <View style={styles.profile_picture_container}>
        <Image
          style={styles.profile_picture}
          source={{
            uri: userProfile?.photo_url
              ? userProfile.photo_url
              : "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
          }}
        ></Image>
        {/* Menu button */}
        {userProfile?.uid == auth.currentUser?.uid ? (
          <TouchableOpacity
            style={styles.menu_button}
            onPress={() => {
              setMenuPopup(true);
            }}
          >
            <Ionicons name="menu" size={36} color={primaryColor} />
          </TouchableOpacity>
        ) : null}
        {/* Menu */}
        <PopUp visible={menuPopup} setVisible={setMenuPopup}>
          <TouchableOpacity
            onPress={handleEditProfile}
            style={styles.menu_item}
          >
            <Feather name="edit-2" size={20} color={primaryColor} />
            <Text style={{ color: primaryColor }}>EDIT PROFILE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignOut}
            // add borderBottomWidth for last menu item
            style={{ ...styles.menu_item, borderBottomWidth: 0 }}
          >
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
        title={showAnnouncements ? "Announcements" : "Events"}
        placeholder_text={showAnnouncements ? "No announcements" : "No events"}
        data={showAnnouncements ? announcement_data : event_data}
        RenderItem={showAnnouncements ? AnnouncementItem : EventItem}
        keyExtractor={(item) => (showAnnouncements ? item.id : item.event_ID)}
        deleter={showAnnouncements ? announcement_deleter : () => {}}
        editer={showAnnouncements ? announcement_editer : () => {}}
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
    start: "87%",
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
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingLeft: 24,
    paddingVertical: 12,
    gap: 24,
  },
});

export default ProfilePageScreen;
