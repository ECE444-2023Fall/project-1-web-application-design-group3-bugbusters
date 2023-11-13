import { useState, useContext, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderBar from "../components/HeaderBar";
import api from "../helpers/API";
import { Ionicons } from "@expo/vector-icons";
import AnnouncementCard from "../components/AnnouncementCard";

const CreateAnnouncementScreen = ({ navigation }) => {
  const contrastColor = useSelector((state) => state.main.contrastColor);
  const [proposedText, setProposedText] = useState("");

  const createAnnouncement = () => {
    // must provide description to create announcement
    if (!proposedText) {
      alert("Invalid: Cannot create announcement with no description");
    } else {
      api.createAnnouncement({ description: proposedText }).then((response) => {
        if (response.result == "SUCCESSFUL") {
          navigation.goBack();
        }
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar
        title="Create Announcement"
        childrenLeft={
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={26} color={contrastColor} />
          </TouchableOpacity>
        }
        childrenRight={<View style={{ width: 26 }} />}
      />
      <View style={styles.container}>
        <AnnouncementCard
          announcement_data={{ description: proposedText }}
          hide_delete_button
          show_popup
          editer={({ text, textSetter, popupSetter }) => {
            textSetter(text);
            setProposedText(text);
            popupSetter(false);
          }}
        />
        <TouchableOpacity
          style={styles.create_button}
          onPress={createAnnouncement}
        >
          <Text style={styles.create_button_text}>CREATE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  create_button: {
    backgroundColor: "#16aed9",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 6,
  },
  create_button_text: { fontsize: 24, fontWeight: 700, color: "white" },
});

export default CreateAnnouncementScreen;
