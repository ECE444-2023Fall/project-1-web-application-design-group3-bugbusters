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
import { AntDesign } from "@expo/vector-icons";

const LandingPageScreen = function ({ navigation }) {
  // const [text, setText] = useState("");
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <HeaderBar
        title="Landing Page"
        childrenLeft={<View style={{ width: 26 }} />}
        childrenRight={
          <TouchableOpacity
            onPress={() => navigation.navigate("Create/Edit Event")}
          >
            <AntDesign name="plus" size={26} color={contrastColor} />
          </TouchableOpacity>
        }
      />
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
