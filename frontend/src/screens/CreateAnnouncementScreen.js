import { useState, useContext } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderBar from "../components/HeaderBar";
import { Ionicons } from "@expo/vector-icons";

const CreateAnnouncementScreen = ({ navigation }) => {
  const contrastColor = useSelector((state) => state.main.contrastColor);

  return (
    <View>
      <HeaderBar
        title="Create/Edit Event"
        childrenLeft={
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={26} color={contrastColor} />
          </TouchableOpacity>
        }
        childrenRight={<View style={{ width: 26 }} />}
      />
      <Text>JOE MAMA</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CreateAnnouncementScreen;
