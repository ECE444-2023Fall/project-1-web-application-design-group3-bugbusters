import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import ProfilePicture from "../components/ProfilePicture";

const EventDetailsScreen = function ({ route, navigation }) {
  const { title } = route.params;
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

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
      <View style={{ ...styles.imageBar, backgroundColor: primaryColor }}>
        <ProfilePicture source={require("../../assets/favicon.png")} />
        <TouchableOpacity>
          <Ionicons name="person-add-outline" color={contrastColor} size={30} />
        </TouchableOpacity>
        <TouchableOpacity /* Add reporting functionality */>
          <MaterialIcons name="report" size={40} color={contrastColor} />
        </TouchableOpacity>
      </View>
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
});

export default EventDetailsScreen;
