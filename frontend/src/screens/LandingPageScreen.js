import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import api from "../helpers/API";
import { useSelector, useDispatch } from "react-redux";
import EventCard from "../components/EventCard";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";

const LandingPageScreen = function ({ navigation }) {
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);
  const userProfileRedux = useSelector(
    (state) => state.main.userProfileData.data,
  );

  const [events, setEvents] = useState([]);
  const [displaySearchBar, setDisplaySearchBar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [reportedEvents, setReportedEvents] = useState(false);
  const refInput = useRef();

  // Land or refresh case
  const fetchEvents = async () => {
    const response = await api.search({ query: "", filter: [] });
    if (response.result == "SUCCESSFUL") {
      setEvents(response.data.results);
    } else {
      // TODO: Display error modal
      // console.error("Events cannot be obtained!!\n");
    }
  };

  // Search case (this will be combined with the above function once getAllEvents endpoint is obsolete)
  const searchEvents = async () => {
    const response = await api.search({
      query: searchText,
      filters: [],
      reported: reportedEvents,
    });
    if (response.result == "SUCCESSFUL") {
      setEvents(response.data.results);
    } else {
      // TODO: Display error modal
      // console.error("Events cannot be obtained!!\n");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: contrastColor }}>
      <HeaderBar
        title="UofT Events Hub"
        childrenLeft={<View style={{ width: 26 }} />}
        childrenRight={
          <TouchableOpacity
            onPress={() => {
              setDisplaySearchBar(true);

              refInput.current?.focus();
            }}
          >
            <Ionicons name="search" size={26} color={contrastColor} />
          </TouchableOpacity>
        }
      />
      <ScrollView
        refreshControl={<RefreshControl onRefresh={() => fetchEvents()} />}
      >
        {/* Sample event, TODO: Remove when done testing */}
        <TouchableOpacity onPress={() => navigation.navigate("Event Details")}>
          <EventCard
            title="Test event"
            owner="Me"
            image="https://picsum.photos/200"
          />
        </TouchableOpacity>
        {events.map((event) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Event Details", {
                  event_id: event?.event_id,
                })
              }
              key={event?.event_id}
            >
              <EventCard
                title={event?.event_title}
                owner={event?.friendly_creator_name}
                image={
                  event?.header_image_URL
                    ? event?.header_image_URL
                    : "https://picsum.photos/200"
                }
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Search bar placed here due to React Native view display */}
      <View
        style={{
          ...styles.searchBar,
          display: displaySearchBar ? null : "none",
        }}
      >
        <TextInput
          ref={refInput}
          selectTextOnFocus={true}
          placeholder="Search"
          style={styles.searchInput}
          autoCorrect={false}
          value={searchText}
          returnKeyType="search"
          clearButtonMode="while-editing"
          onChangeText={(text) => {
            setSearchText(text);
          }}
          onSubmitEditing={() => {
            searchEvents();
            setDisplaySearchBar(false);
          }}
          onBlur={() => setDisplaySearchBar(false)}
        />
        <TouchableOpacity
          style={{
            ...styles.checkBoxContainer,
            display: userProfileRedux?.is_admin ? null : "none",
          }}
          onPress={() => setReportedEvents(!reportedEvents)}
        >
          <Text>Reported Events</Text>
          <Checkbox
            style={{ ...styles.checkBox, backgroundColor: contrastColor }}
            value={reportedEvents}
            onValueChange={setReportedEvents}
            color={reportedEvents ? primaryColor : undefined}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#D9D9D9",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    width: "100%",
    position: "absolute",
    top: 86,
  },
  searchInput: {
    marginHorizontal: 20,
    marginVertical: 14,
    fontSize: 16,
    borderRadius: 8,
    paddingLeft: 6,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  checkBoxContainer: {
    marginBottom: 14,
    alignSelf: "flex-end",
    marginHorizontal: 30,
    flexDirection: "row",
  },
  checkBox: {
    marginHorizontal: 10,
  },
});

export default LandingPageScreen;
