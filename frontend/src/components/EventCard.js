import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const EventCard = function () {
  return (
    <View style={styles.cardContainer}>
      {/* <Image source={}/> */}
      <View
        style={{
          backgroundColor: "grey",
          height: 140,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            alignSelf: "center",
          }}
        >
          Placeholder for image
        </Text>
      </View>
      <View style={styles.cardBar}>
        <View style={{ width: 50 }}></View>
        <View>
          <Text style={styles.eventTitle}>Event Title</Text>
          <Text style={styles.eventOwner}>Event Owner</Text>
        </View>
        <TouchableOpacity style={styles.reportButton}>
          <MaterialIcons name="report" size={40} color="#25355A" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 20,
    borderRadius: 10,
    height: 220,
    overflow: "hidden",
  },
  cardBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ECEBEA",
  },
  eventTitle: { alignSelf: "center", fontSize: 18, fontWeight: "bold" },
  eventOwner: { alignSelf: "center" },
  reportButton: { paddingRight: 10 },
});

export default EventCard;
