import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import PopUp from "./PopUp";
import api from "../helpers/API";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const AnnouncementCard = function ({ announcement_data, deleter }) {
  const buttonSize = 28;
  const [description, setDescription] = useState(
    announcement_data?.description
  );
  const [editPopup, setEditPopup] = useState(false);
  const [editText, setEditText] = useState(announcement_data?.description);
  const primaryColor = useSelector((state) => state.main.primaryColor);

  return (
    <View style={styles.announcementContainer}>
      <Text style={styles.announcementText}>{description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            setEditPopup(true);
            console.log("EDITING", announcement_data?.id);
          }}
        >
          <Feather name="edit-2" size={buttonSize} style={styles.button} />
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
          <PopUp visible={editPopup} setVisible={setEditPopup}>
            <TextInput
              value={editText}
              onChangeText={(text) => {
                setEditText(text);
              }}
              style={{ ...styles.input, borderColor: primaryColor }}
              autoFocus
              onPressIn={() => {
                console.log("PRESSED");
              }}
            />
            <TouchableOpacity
              style={styles.done_editing_button}
              onPress={() => {
                api
                  .editAnnouncement(editText, announcement_data?.id)
                  .then((response) => {
                    if (response.result == "SUCCESSFUL") {
                      setDescription(editText);
                      setEditPopup(false);
                    } else {
                      // show UI that it didn't work
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              <Text style={styles.done_editing_text}>DONE</Text>
            </TouchableOpacity>
          </PopUp>
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
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 3,
    outlineStyle: "none",
    width: "calc(100% - 24px)",
  },
  done_editing_button: {
    backgroundColor: "#16aed9",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  done_editing_text: {
    color: "white",
  },
});

export default AnnouncementCard;
