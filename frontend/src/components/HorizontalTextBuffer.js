import { StyleSheet, Text, View } from "react-native";

const HorizontalTextBuffer = function ({ text="OR" }) {
    return (
        <View style={styles.horizontalLineBufferContainer}>
            <View style={styles.horizontalLineBuffer}></View>
            <Text numberOfLines={1} style={styles.horizontalLineBufferText}>{text}</Text>
            <View style={styles.horizontalLineBuffer}></View>
        </View>
    )
}

export default HorizontalTextBuffer

const styles = StyleSheet.create({
    horizontalLineBufferContainer: {
        flexDirection: "row",
        width: "100%",
        marginVertical: 10,
        alignItems: "center"
    },
    horizontalLineBufferText: {
        textAlign: "center",
        fontWeight: 600,
        fontSize: 14,
        marginHorizontal: 5
    },
    horizontalLineBuffer: {
        color: "grey", 
        backgroundColor: "grey",
        flex: 1,
        borderRadius: 5,
        height: 1
    }
})
