import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, KeyboardAvoidingView, Text, TextInput, View, TouchableOpacity } from "react-native";
import { 
    getAuth, createUserWithEmailAndPassword, sendEmailVerification,
    signInWithEmailAndPassword, signOut, updateProfile
} from "firebase/auth";
import HorizontalTextBuffer from "../components/HorizontalTextBuffer";
import api from "../helpers/API";
import { useDispatch } from "react-redux";
import { SETUSERDATA } from "../store/ActionType";

const AuthPageScreen = function () {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showLogin, setShowLogin] = useState(true);
    // redux for user profile data
    const dispatch = useDispatch()

    const navigation = useNavigation();

    const navigateSignUp = () => {
        setShowLogin(false);
    }

    const navigateLogIn = () => {
        setShowLogin(true);
    }

    const handleSignUp = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            updateProfile(user, {displayName: displayName})
            // do not log in during account creation
            signOut(auth).then(() => {
                setShowLogin(true)
                navigation.navigate("Authentication Page")
            })
            sendEmailVerification(user).then(() => {
                console.log("EMAIL VERIFICATION SENT!")
            })
            console.log(user);
        })
        .catch(error => alert(error.message))
    }

    const handleLogin = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log(user)
            // user must be verified to log in
            if (!user.emailVerified) {
                signOut(auth).then(() => {
                    navigation.navigate("Authentication Page")
                    Alert.alert("Email is not verified!",
                                message="Please check the email you used to register.")
                    console.log("SIGNED OUT")
                }).catch((error) => {
                    // An error happened.
                    console.log(error);
                });
            }
            // user is verified, now get their UserProfile
            // uid = user.uid
            uid = 123
            api.getUserProfile(uid).then((userProfile) => {
                dispatch({ type: SETUSERDATA, payload: userProfile })
            })
        })
        .catch(error => alert(error.message))
    }

    return (showLogin) ? (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="E-MAIL"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="PASSWORD"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
                <HorizontalTextBuffer></HorizontalTextBuffer>
                <TouchableOpacity
                    onPress={navigateSignUp}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>SIGN UP</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    ) : (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="USERNAME"
                    value={displayName}
                    onChangeText={text => setDisplayName(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="E-MAIL"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="PASSWORD"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>
                <HorizontalTextBuffer></HorizontalTextBuffer>
                <TouchableOpacity
                    onPress={navigateLogIn}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>LOG IN</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        width: "80%",
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: "60%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    button: {
        backgroundColor: "#1E3765",
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: 700,
        fontSize: 16,
    },
    buttonOutline: {
        backgroundColor: "white",
        borderColor: "#1E3765",
        borderWidth: 2,
        marginTop: 5,
    },
    buttonOutlineText: {
        color: "1E3765",
        fontWeight: 700,
        fontSize: 16,
    },
});

export default AuthPageScreen;
