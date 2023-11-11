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

const AnnouncementCard = function ({
  announcement_data,
  show_popup = false,
  hide_edit_button = false,
  hide_delete_button = false,
  show_minimize_button = false,
  editer,
  deleter,
  style,
}) {
  const buttonSize = 28;
  const [description, setDescription] = useState(
    announcement_data?.description
  );
  const [minimized, setMinimize] = useState(false);
  const [editPopup, setEditPopup] = useState(show_popup);
  const [editText, setEditText] = useState(announcement_data?.description);
  const primaryColor = useSelector((state) => state.main.primaryColor);

  return minimized ? (
    <View style={{ ...styles.announcementContainer, ...style }}>
      {show_minimize_button ? (
        <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
          <TouchableOpacity onPress={() => setMinimize(!minimized)}>
            <Feather
              name={minimized ? "maximize-2" : "minimize-2"}
              size={buttonSize - 6}
              style={{ ...styles.button, marginVertical: 4 }}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  ) : (
    <View style={{ ...styles.announcementContainer, ...style }}>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Text style={styles.announcementText}>{description}</Text>
        {show_minimize_button ? (
          <TouchableOpacity onPress={() => setMinimize(!minimized)}>
            <Feather
              name={minimized ? "maximize-2" : "minimize-2"}
              size={buttonSize - 6}
              style={{ ...styles.button, marginTop: 12 }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.buttonContainer}>
        {hide_edit_button ? null : (
          <TouchableOpacity
            onPress={() => {
              setEditPopup(true);
            }}
          >
            <Feather name="edit-2" size={buttonSize} style={styles.button} />
          </TouchableOpacity>
        )}
        {hide_delete_button ? null : (
          <TouchableOpacity
            onPress={() => deleter({ id: announcement_data?.id })}
          >
            <MaterialIcons
              name="delete-outline"
              size={buttonSize}
              style={styles.button}
            />
          </TouchableOpacity>
        )}
        <PopUp
          visible={editPopup}
          setVisible={setEditPopup}
          onClose={() => {
            setEditText(description);
          }}
        >
          <TextInput
            value={editText}
            onChangeText={(text) => {
              setEditText(text);
            }}
            style={{ ...styles.input, borderColor: primaryColor }}
            autoFocus
            selectTextOnFocus
            multiline
            placeholder="Enter description"
            placeholderTextColor={"grey"}
          />
          <TouchableOpacity
            style={styles.done_editing_button}
            onPress={() => {
              // only edit description if text has changed
              if (editText != description) {
                editer({
                  text: editText,
                  id: announcement_data?.id,
                  textSetter: setDescription,
                  popupSetter: setEditPopup,
                });
              } else {
                setEditPopup(false);
              }
            }}
          >
            <Text style={styles.done_editing_text}>DONE</Text>
          </TouchableOpacity>
        </PopUp>
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
  announcementText: { paddingVertical: 16, fontWeight: 700, fontSize: 18 },
  buttonContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  button: {
    paddingHorizontal: 4,
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
    fontWeight: 700,
    color: "white",
  },
});

export default AnnouncementCard;
