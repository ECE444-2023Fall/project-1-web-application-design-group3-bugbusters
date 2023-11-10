import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import api from "../helpers/API";

const AnnouncementCard = function ({ announcement_data, deleter }) {
  const buttonSize = 28;

  return (
    <View style={styles.announcementContainer}>
      <Text style={styles.announcementText}>
        {announcement_data?.description}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log("EDITING", announcement_data?.id);
          }}
        >
          <Feather name="edit" size={buttonSize} style={styles.button} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            api.deleteAnnouncement(announcement_data?.id);
            deleter(announcement_data?.id);
            console.log("DELETED", announcement_data?.id);
          }}
        >
          <MaterialIcons
            name="delete-outline"
            size={buttonSize}
            style={styles.button}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  announcementContainer: {
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    overflow: "scroll",
    borderWidth: 4,
    borderColor: "#FF5C00",
  },
  announcementText: { fontWeight: 700, fontSize: 18 },
  buttonContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  button: {
    paddingLeft: 8,
    color: "#858585",
  },
});

export default AnnouncementCard;
