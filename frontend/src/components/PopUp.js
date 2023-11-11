import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

const PopUp = function ({ children, visible, setVisible, onClose }) {
  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
        onClose();
      }}
      animationType="fade"
      transparent={true}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (onClose) {
            onClose();
          }
          setVisible(false);
        }}
      >
        <View style={styles.popUpBkgndStyle}>
          <View style={styles.popUpStyle}>{children ? children : null}</View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popUpBkgndStyle: {
    backgroundColor: "#00000080",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popUpStyle: {
    backgroundColor: "white",
    width: 344,
    paddingVertical: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PopUp;
