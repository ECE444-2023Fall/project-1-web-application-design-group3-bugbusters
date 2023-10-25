import { StyleSheet, Text, View } from "react-native";

const HorizontalTextBuffer = function ({ text="OR" }) {
    return (
        <View style={styles.horizontalLineBufferContainer}>
            <hr style={styles.horizontalLineBuffer}></hr>
            <Text numberOfLines={1} style={styles.horizontalLineBufferText}>{text}</Text>
            <hr style={styles.horizontalLineBuffer}></hr>
        </View>
    )
}

export default HorizontalTextBuffer

const styles = StyleSheet.create({
    horizontalLineBufferContainer: {
        flexDirection: "row",
        width: "100%",
        marginVertical: 10
    },
    horizontalLineBufferText: {
        flex: 1,
        textAlign: "center",
        fontWeight: 600,
        fontSize: 14
    },
    horizontalLineBuffer: {
        color: "grey", 
        backgroundColor: "grey",
        width: "45%",
        borderRadius: 5,
        height: 2
    }
})
