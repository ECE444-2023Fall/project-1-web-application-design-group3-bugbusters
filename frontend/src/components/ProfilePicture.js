import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

const ProfilePicture = function ({
  source,
  customStyle,
  onPress,
  children,
  customOpacity,
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={customOpacity}>
      <Image
        style={customStyle ? customStyle : styles.imageStyle}
        // source={{ uri: source?.uri ? source.uri : source }}
        source={source}
      />
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 30,
    height: 30,
  },
});

export default ProfilePicture;
