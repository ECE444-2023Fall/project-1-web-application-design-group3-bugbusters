import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../store/Action";
import EventCard from "../components/EventCard";

const LandingPageScreen = function ({ navigation }) {
  // const [text, setText] = useState("");
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  const fetchEvents = async () => {
    const response = await api.getAllEvents();
    console.log("response:", response);
    if (response.result == "SUCCESSFUL") {
      console.log("Set something\n");
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <HeaderBar title="Landing Page" align="center" />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Event Details", {
            title: "Event Details",
          })
        }
      >
        <EventCard title="Event Title" owner="Event Owner" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default LandingPageScreen;
