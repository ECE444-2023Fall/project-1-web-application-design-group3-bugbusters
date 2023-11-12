import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import api from "../helpers/API";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../store/Action";
import EventCard from "../components/EventCard";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import AnnouncementCard from "../components/AnnouncementCard";

const LandingPageScreen = function ({ navigation }) {
  // const [text, setText] = useState("");
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [displaySearchBar, setDisplaySearchBar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const refInput = useRef();

  // Land or refresh case
  const fetchEvents = async () => {
    const response = await api.getAllEvents();
    if (response.result == "SUCCESSFUL") {
      setEvents(response.data);
      // console.log(events);
    } else {
      // TODO: Display error modal
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
    const response = await api.search({ query: searchText, filters: [] });
    if (response.result == "SUCCESSFUL") {
      setEvents(response.data.results);
    } else {
      // TODO: Display error modal
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
        title="Landing Page"
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
        style={{ marginTop: 4, marginBottom: 20 }}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              fetchEvents();
              fetchAnnouncements();
            }}
          />
        }
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
                  event_id: event?._event_id,
                })
              }
              key={event?._event_id}
            >
              <EventCard
                title={event?._event_title}
                owner={event?._creator_id}
                image={
                  event?._images?._header_image
                    ? event?._images?._header_image
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
});

export default LandingPageScreen;
