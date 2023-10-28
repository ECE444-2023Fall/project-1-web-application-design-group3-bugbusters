import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

const HeaderBar = function ({
  childrenLeft,
  childrenRight,
  childrenMid,
  title,
  titleStyle,
  height,
  align,
}) {
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  return (
    <View
      style={
        height || align
          ? {
              ...styles.containerStyle,
              backgroundColor: primaryColor,
              height: height ? height : styles.containerStyle.height,
              justifyContent: align
                ? align
                : styles.containerStyle.justifyContent,
            }
          : { ...styles.containerStyle, backgroundColor: primaryColor }
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
    width: "100%",
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
