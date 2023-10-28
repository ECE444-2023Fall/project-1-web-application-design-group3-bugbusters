import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector, useDispatch } from "react-redux";

const EventCard = function ({ navigation, image, title, owner }) {
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

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
          <Text style={styles.eventTitle}>{title}</Text>
          <Text style={styles.eventOwner}>{owner}</Text>
        </View>
        <TouchableOpacity style={styles.reportButton}>
          <MaterialIcons name="report" size={40} color={primaryColor} />
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
