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

  // const currentEventRedux = useSelector((state) => state.currentEventData);
  const userProfileRedux = useSelector((state) => state.userProfileData);

  const [currentEvent, setCurrentEvent] = useState({});
  async function retrieveEvent(id) {
    const response = await api.getEvent(id);
    if (response.result == "SUCCESSFUL") {
      setCurrentEvent(response.data);
    }
  }

  useEffect(() => {
    retrieveEvent(event_id);
  }, [event_id]);

  const [isOwner, setOwner] = useState(
    userProfileRedux?.uid &&
      currentEvent?._creator_id &&
      userProfileRedux?.uid == currentEvent?._creator_id,
  );
  const [rsvpPopup, setRsvpPopup] = useState(false);
  const [rsvped, setRsvped] = useState(false); // TODO: If user is logged in, logic should be to check if user email is in the rsvp list
  const [rsvpTextInput, setRsvpTextInput] = useState("");

  async function rsvp(event_id, email) {
    const response = await api.rsvp({ event_id, email });
    if (response.result == "SUCCESSFUL") {
      setRsvped(true);
    }
  }

  async function sendRsvp(event_id) {
    const response = await api.sendRsvp(event_id);
    if (response.result == "ERROR") {
      console.error("Couldn't send rsvp info");
    }
  }

  return (
    <View>
      <HeaderBar
        title="Event Details Screen"
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
        {isOwner ? (
          <TouchableOpacity
            onPress={() => {
              // send rsvp info to attendees
              sendRsvp(currentEvent?._event_id);
              setRsvpPopup(true);
            }}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={34}
              color={contrastColor}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              // rsvp to event
              setRsvpPopup(true);
            }}
          >
            <AntDesign name="adduser" color={contrastColor} size={30} />
          </TouchableOpacity>
        )}
        <TouchableOpacity /* Add reporting functionality */>
          <MaterialIcons name="report" size={40} color={contrastColor} />
        </TouchableOpacity>
      </View>

      {/* Event Information */}
      <View style={styles.eventInfo}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Creator: </Text>
          <Text>
            {currentEvent?._creator_id
              ? currentEvent?._creator_id
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

      <PopUp visible={rsvpPopup} setVisible={setRsvpPopup}>
        {isOwner ? (
          <Text>Render rsvp info here</Text>
        ) : (
          <View>
            <Text>Render event registry status here</Text>
            <TextInput onChangeText={setRsvpTextInput} />
            <TouchableOpacity
              onPress={() => rsvp(currentEvent?._event_id, rsvpTextInput)}
            >
              <Text>Send</Text>
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
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});

export default EventDetailsScreen;
