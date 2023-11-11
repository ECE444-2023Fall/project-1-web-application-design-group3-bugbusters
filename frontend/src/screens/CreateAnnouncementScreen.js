import { useState, useContext, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderBar from "../components/HeaderBar";
import PopUp from "../components/PopUp";
import { Ionicons } from "@expo/vector-icons";
import AnnouncementCard from "../components/AnnouncementCard";

const CreateAnnouncementScreen = ({ navigation }) => {
  const contrastColor = useSelector((state) => state.main.contrastColor);
  const [showPopup, setShowPopup] = useState(true);

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
          announcement_data={{ description: "Testing creation" }}
        />
      </View>
      <PopUp visible={showPopup} setVisible={setShowPopup}>
        <Text>JOE MAMA</Text>
      </PopUp>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default CreateAnnouncementScreen;
