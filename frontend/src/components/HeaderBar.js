import React from "react";
import { Text, StyleSheet, View } from "react-native";

const HeaderBar = function ({
  childrenLeft,
  childrenRight,
  childrenMid,
  title,
  titleStyle,
  height,
  align,
}) {
  return (
    <View
      style={
        height || align
          ? {
              ...styles.containerStyle,
              height: height ? height : styles.containerStyle.height,
              justifyContent: align
                ? align
                : styles.containerStyle.justifyContent,
            }
          : styles.containerStyle
      }
    >
      {childrenLeft}
      {childrenMid ? (
        childrenMid
      ) : (
        <Text style={titleStyle ? titleStyle : styles.titleStyle}>{title}</Text>
      )}

      {childrenRight}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "#1E3765",
    height: 86,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  titleStyle: {
    color: "white",
    fontSize: 20,
    justifyContent: "center",
  },
});

export default HeaderBar;
