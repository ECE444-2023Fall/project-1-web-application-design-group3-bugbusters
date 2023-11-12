import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector, useDispatch } from "react-redux";
import api from "../helpers/API";
import { Ionicons } from "@expo/vector-icons";

const EventCard = function ({ navigation, image, title, owner, id }) {
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);
  const userProfileRedux = useSelector((state) => state.userProfileData);

  const [isReported, setIsReported] = useState(false);
  const [isAdmin, setIsAdmin] = useState(userProfileRedux?.is_admin);

  const reportEvent = async () => {
    const response = await api.report(id);
    if (response.result == "SUCCESSFUL") {
      // Event reported
      setIsReported(true);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Image style={{ height: 200 }} source={{ uri: image }} />
      <View style={styles.cardBar}>
        <View style={{ width: 60 }}></View>
        <View>
          <Text style={styles.eventTitle}>{title}</Text>
          <Text style={styles.eventOwner}>{owner}</Text>
        </View>
        {isAdmin ? (
          <View style={{ width: 60 }} />
        ) : isReported ? (
          <View style={styles.reportButton}>
            <Ionicons name="checkmark-sharp" size={40} color={primaryColor} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => reportEvent()}
          >
            <MaterialIcons name="report" size={40} color={primaryColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 20,
    borderRadius: 10,
    height: 280,
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
  reportButton: { paddingRight: 20 },
});

export default EventCard;
