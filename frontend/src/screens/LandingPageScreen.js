import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import api from "../helpers/API";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../store/Action";
import EventCard from "../components/EventCard";

const LandingPageScreen = function ({ navigation }) {
  // const [text, setText] = useState("");
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const response = await api.getAllEvents();
    // console.log("response:", response);
    if (response.result == "SUCCESSFUL") {
      // console.log("Events successfully obtained\n");
      // console.log("Successful response: ", response.data);
      setEvents(response.data);
      // console.log(events);
    } else {
      // Display error modal
      console.error("Events cannot be obtained!!\n");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <HeaderBar title="Landing Page" align="center" />
      {/* <TouchableOpacity
        onPress={() =>
          navigation.navigate("Event Details", {
            event_id: "Event Details",
          })
        }
      >
        <EventCard title="Event Title" owner="Event Owner" />
      </TouchableOpacity> */}
      <ScrollView refreshControl={<RefreshControl onRefresh={() => fetchEvents()} />}>
      {events.map((event) => {
        <TouchableOpacity
        onPress={() =>
          navigation.navigate("Event Details", {
            event_id: event?._event_id,
          })
        }
        >
          <EventCard title="Hello?" owner="Event Owner" />
        </TouchableOpacity>;
      })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default LandingPageScreen;
