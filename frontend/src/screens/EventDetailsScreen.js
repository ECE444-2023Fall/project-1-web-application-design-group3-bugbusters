import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
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

const EventDetailsScreen = function ({ route, navigation }) {
  const { title } = route.params;
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  const currentEventRedux = useSelector((state) => state.currentEventData);

  const [isOwner, setOwner] = useState(false);
  const [rsvpPopup, setRsvpPopup] = useState(false);

  return (
    <View>
      <HeaderBar
        title={title}
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
      <View
        style={{
          backgroundColor: "grey",
          height: 300,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Placeholder for Image</Text>
      </View>

      {/* Bar below the image */}
      <View style={{ ...styles.imageBar, backgroundColor: primaryColor }}>
        <ProfilePicture source={require("../../assets/favicon.png")} />
        {isOwner ? (
          <TouchableOpacity onPress={() => setRsvpPopup(true)}>
            <MaterialCommunityIcons
              name="email-outline"
              size={34}
              color={contrastColor}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setRsvpPopup(true)}>
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
            {currentEventRedux?.creator
              ? currentEventRedux?.creator
              : "No creator name"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Start time: </Text>
          <Text>
            {currentEventRedux?.starttime
              ? currentEventRedux?.starttime
              : "No start time"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>End time: </Text>
          <Text>
            {currentEventRedux?.endtime
              ? currentEventRedux?.endtime
              : "No start end"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Location: </Text>
          <Text>
            {currentEventRedux?.location
              ? currentEventRedux?.location
              : "No location"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Description: </Text>
          <Text>
            {currentEventRedux?.description
              ? currentEventRedux?.description
              : "No description"}
          </Text>
        </View>
      </View>

      <PopUp visible={rsvpPopup} setVisible={setRsvpPopup}>
        {isOwner ? (
          <Text>Render rsvp info here</Text>
        ) : (
          <Text>Render event registry status here</Text>
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