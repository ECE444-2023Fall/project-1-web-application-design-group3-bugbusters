import { useState, useContext, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderBar from "../components/HeaderBar";
import PopUp from "../components/PopUp";
import { Ionicons } from "@expo/vector-icons";
import AnnouncementCard from "../components/AnnouncementCard";

const CreateAnnouncementScreen = ({ navigation }) => {
  const contrastColor = useSelector((state) => state.main.contrastColor);
  const [proposedText, setProposedText] = useState("");

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
          show_delete_button={false}
          show_popup
          editer={({ text, textSetter, popupSetter }) => {
            textSetter(text);
            setProposedText(text);
            popupSetter(false);
            console.log("EDITER CALLBACK WORKING");
          }}
          deleter={() => console.log("DELETER CALLBACK WORKING")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default CreateAnnouncementScreen;
