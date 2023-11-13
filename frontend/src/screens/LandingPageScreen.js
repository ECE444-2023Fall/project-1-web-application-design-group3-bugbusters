import React, { useState, useRef, useEffect } from "react";
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
import AnnouncementCard from "../components/AnnouncementCard";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";

const LandingPageScreen = function ({ navigation }) {
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);
  const userProfileRedux = useSelector((state) => state.main.userProfileData);

  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [displaySearchBar, setDisplaySearchBar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [reportedEvents, setReportedEvents] = useState(false);
  const refInput = useRef();

  // Land or refresh case
  const fetchEvents = async () => {
    const response = await api.search({ query: "", filters: [] });
    console.log(response.data.results);
    if (response.result == "SUCCESSFUL") {
      setEvents(response.data.results);
    } else {
      // console.error("Events cannot be obtained!!\n");
    }
  };

  const fetchAnnouncements = async () => {
    const response = await api.getAllAnnouncements();
    if (response.result == "SUCCESSFUL") {
      setAnnouncements(response.data);
    } else {
      alert("FAILED TO GET ALL ANNOUNCEMENTS");
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
      // console.error("Events cannot be obtained!!\n");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      setAnnouncements([]); // must reset state for some weird reason
      fetchEvents();
      fetchAnnouncements();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

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
      {announcements.map((announcement, key) => {
        return (
          <AnnouncementCard
            key={key}
            announcement_data={announcement}
            hide_edit_button
            hide_delete_button
            show_minimize_button
            style={styles.announcement_style}
          />
        );
      })}
      <ScrollView
        style={{ marginTop: 4, marginBottom: 80 }}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              fetchEvents();
              fetchAnnouncements();
            }}
          />
        }
      >
        {events.length ? (
          events.map((event) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Event Details", {
                    event_id: event?.event_ID,
                  })
                }
                key={event?.event_ID}
              >
                <EventCard
                  title={event?.event_title}
                  owner={event?.friendly_creator_name}
                  image={
                    event?.header_image_URL
                      ? event?.header_image_URL
                      : "https://picsum.photos/200"
                  }
                  id={event?.event_ID}
                />
              </TouchableOpacity>
            );
          })
        ) : (
          <View
            style={{
              alignItems: "center",
              paddingTop: 80,
              justifyContent: "space-between",
              height: 150,
            }}
          >
            <Text style={styles.noEventsText}>
              No events to view at this moment.
            </Text>
            <Text style={styles.noEventsText}>Tune in later!</Text>
          </View>
        )}
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
  announcement_style: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 0,
    paddingVertical: 0,
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
  noEventsText: {
    fontSize: 18,
  },
});

export default LandingPageScreen;
