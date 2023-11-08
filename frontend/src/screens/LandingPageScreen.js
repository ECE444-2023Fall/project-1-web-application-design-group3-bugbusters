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
    if (response.result == "SUCCESSFUL") {
      setEvents(response.data);
    } else {
      // TODO: Display error modal
      console.error("Events cannot be obtained!!\n");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <HeaderBar title="Landing Page" align="center" />
      <ScrollView
        refreshControl={<RefreshControl onRefresh={() => fetchEvents()} />}
      >
        {events.map((event) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Event Details", {
                  event_id: event?._event_id,
                })
              }
              key={event?._event_id}
            >
              <EventCard
                title={event?._event_title}
                owner={event?._creator_id}
                image={event?._images?._header_image}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default LandingPageScreen;
