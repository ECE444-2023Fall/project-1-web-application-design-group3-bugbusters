import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import ProfilePicture from "../components/ProfilePicture";
import PopUp from "../components/PopUp";
import api from "../helpers/API";

const EventDetailsScreen = function ({ route, navigation }) {
  const event_id = route?.params?.event_id;
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  const userProfileRedux = useSelector((state) => state.main.userProfileData);

  const [currentEvent, setCurrentEvent] = useState({});
  const [currentEventUser, setCurrentEventUser] = useState({});
  const [isOwner, setOwner] = useState(
    userProfileRedux?.uid &&
      currentEvent?._creator_id &&
      userProfileRedux?.uid == currentEvent?._creator_id,
  );
  const [isReported, setIsReported] = useState(false);
  const [isAdmin, setIsAdmin] = useState(userProfileRedux?.is_admin);

  useEffect(() => {
    async function retrieveEvent(id) {
      const response = await api.getEvent(id);
      if (response.result == "SUCCESSFUL") {
        setCurrentEvent(response.data);
      }
    }
    async function retrieveEventUser(uid) {
      const response = await api.getUserProfile(uid);
      if (response.result == "SUCCESSFUL") {
        setCurrentEventUser(response.data);
      }
    }
    retrieveEvent(event_id);

    if (isOwner) {
      setCurrentEventUser(userProfileRedux);
    } else {
      retrieveEventUser(currentEvent?._creator_id);
    }
  }, [event_id]);

  const [rsvpPopup, setRsvpPopup] = useState(false);
  const [rsvped, setRsvped] = useState(
    currentEvent?._rsvp_email_list?.includes(userProfileRedux?.email),
  );
  const [rsvpInfoSent, setRsvpInfoSent] = useState(currentEvent?._rsvp_sent);
  const [rsvpTextInput, setRsvpTextInput] = useState("");
  const [emailNotValid, setEmailNotValid] = useState(false);

  const validEmails = ["mail.utoronto.ca", "utoronto.ca"];

  const endsWithAny = (string, suffixes) => {
    return suffixes.some((suffix) => {
      return string.endsWith(suffix);
    });
  };

  async function rsvp(event_id, email) {
    const response = await api.rsvp({ event_id, email });
    if (response.result == "SUCCESSFUL") {
      setRsvped(true);
      setRsvpTextInput("");
    } else {
      if (response.data.status_code == 409) {
        // Already RSVP'ed
        setRsvped(true);
        setRsvpTextInput("");
      } else {
        console.error("Could not rsvp");
      }
    }
  }

  async function sendRsvp(event_id) {
    const response = await api.sendRsvp(event_id);
    if (response.result == "SUCCESSFUL") {
      setRsvpInfoSent(true);
    } else {
      if (response.data.status_code == 409) {
        // RSVP info already sent
        setRsvpInfoSent(true);
      } else {
        console.error("Couldn't send rsvp info");
      }
    }
  }

  const reportEvent = async () => {
    const response = await api.report(event_id);
    if (response.result == "SUCCESSFUL") {
      // Event reported
      setIsReported(true);
    }
  };

  const deleteEventAdmin = async () => {
    const response = await api.deleteEventfromSearch(event_id);
    if (response.result == "SUCCESSFUL") {
      const response2 = await api.deleteEvent(event_id);
      if (response2.result == "SUCCESSFUL") {
        // Event deleted from both algolia and firebase
        navigation.goBack();
      } else {
        // Failed to delete event from firebase
      }
    } else {
      // Failed to delete event from algolia
    }
  };

  return (
    <View>
      <HeaderBar
        title={
          currentEvent?._event_title
            ? currentEvent?._event_title
            : "No Event Title"
        }
        childrenLeft={
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={30} color={contrastColor} />
          </TouchableOpacity>
        }
        childrenRight={<View style={{ marginRight: 30 }} />}
      />

      {/* Image gallery (Swipeable) */}
      <Image
        style={{
          height: 300,
          resizeMode: "contain",
          justifyContent: "center",
          alignItems: "center",
        }}
        source={{
          uri: currentEvent?._images?._header_image
            ? currentEvent?._images?._header_image
            : "https://picsum.photos/200/300",
        }}
      />

      {/* Bar below the image */}
      <View style={{ ...styles.imageBar, backgroundColor: primaryColor }}>
        <ProfilePicture
          source={{
            uri: currentEvent?._images?._profile_image
              ? currentEvent?._images?._profile_image
              : "https://picsum.photos/200",
          }}
        />
        {isAdmin ? null : (
          <TouchableOpacity
            onPress={() => {
              setRsvpPopup(true);
            }}
          >
            {isOwner ? (
              <MaterialCommunityIcons
                name="email-outline"
                size={34}
                color={contrastColor}
              />
            ) : (
              <AntDesign name="adduser" color={contrastColor} size={30} />
            )}
          </TouchableOpacity>
        )}
        {isAdmin ? (
          <TouchableOpacity
            onPress={() => {
              deleteEventAdmin();
            }}
          >
            <MaterialIcons
              name="delete-outline"
              size={32}
              color={contrastColor}
            />
          </TouchableOpacity>
        ) : isOwner ? (
          <View style={{ width: 40 }} />
        ) : isReported ? (
          <View style={styles.reportButton}>
            <Ionicons name="checkmark-sharp" size={36} color={contrastColor} />
          </View>
        ) : (
          <TouchableOpacity onPress={() => reportEvent()}>
            <MaterialIcons name="report" size={40} color={contrastColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Event Information */}
      <View style={styles.eventInfo}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Creator: </Text>
          <Text>
            {currentEventUser?.display_name
              ? currentEventUser?.display_name
              : "No creator name"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Start time: </Text>
          <Text>
            {currentEvent?._event_start_time
              ? currentEvent?._event_start_time
              : "No start time"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>End time: </Text>
          <Text>
            {currentEvent?._event_end_time
              ? currentEvent?._event_end_time
              : "No start end"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Location: </Text>
          <Text>
            {currentEvent?._location ? currentEvent?._location : "No location"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Description: </Text>
          <Text>
            {currentEvent?._description
              ? currentEvent?._description
              : "No description"}
          </Text>
        </View>
      </View>

      {/* RSVP pop up */}
      <PopUp visible={rsvpPopup} setVisible={setRsvpPopup}>
        {isOwner ? (
          // Owner of displayed event
          rsvpInfoSent ? (
            <Text style={styles.textStyle}>RSVP information sent!</Text>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.titleStyle}>Send RSVP Info?</Text>
              <TouchableOpacity
                onPress={() => {
                  sendRsvp();
                }}
                style={styles.sendButtonStyle}
              >
                <FontAwesome name="send" size={30} color={primaryColor} />
              </TouchableOpacity>
            </View>
          )
        ) : rsvped ? (
          <Text style={styles.textStyle}>RSVP sent!</Text>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.titleStyle}>RSVP</Text>
            <TextInput
              onChangeText={setRsvpTextInput}
              placeholder="Enter your email..."
              style={styles.textInputStyle}
              placeholderTextColor="white"
              selectTextOnFocus={true}
              autoFocus
              autoCorrect={false}
              value={rsvpTextInput}
              returnKeyType="done"
              clearButtonMode="while-editing"
            />
            <Text
              style={{
                ...styles.errorTextStyle,
                display: emailNotValid ? null : "none",
              }}
            >
              Input is not a valid email address
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (!endsWithAny(rsvpTextInput, validEmails)) {
                  setEmailNotValid(true);
                } else {
                  setEmailNotValid(false);
                  rsvp(currentEvent?._event_id, rsvpTextInput);
                }
              }}
              style={styles.sendButtonStyle}
            >
              <FontAwesome name="send" size={30} color={primaryColor} />
            </TouchableOpacity>
          </View>
        )}
      </PopUp>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginBottom: -2,
  },
  imageBar: {
    height: 60,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  eventInfo: {
    paddingTop: 36,
    paddingHorizontal: 36,
  },
  titleStyle: {
    fontWeight: "bold",
    fontSize: 22,
  },
  textInputStyle: {
    backgroundColor: "#D9D9D9",
    fontSize: 16,
    width: 260,
    paddingLeft: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 18,
  },
  sendButtonStyle: {
    marginTop: 20,
    paddingHorizontal: 60,
  },
  textStyle: {
    fontSize: 16,
  },
  errorTextStyle: {
    marginTop: 4,
    fontSize: 12,
    color: "red",
  },
});

export default EventDetailsScreen;
