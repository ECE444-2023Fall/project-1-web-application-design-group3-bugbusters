import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderBar from "../components/HeaderBar";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";

const profileHeight = 80;
const profileWidth = 80;

const EditProfileScreen = function ({ navigation, route }) {
  const { userProfile } = route.params;
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  const [profileUrl, setProfileUrl] = useState(userProfile?.photo_url);

  const pickImage = () => {
    // No permissions request is necessary for launching the image library
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }).then(async (pickerResult) => {
      console.log(pickerResult);
      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        // handle uploadUrl has desired
        setProfileUrl(uploadUrl);
      }
    });

    async function uploadImageAsync(uri) {
      // Why are we using XMLHttpRequest? See:
      // https://github.com/expo/expo/issues/2402#issuecomment-443726662
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const fileRef = ref(getStorage(), "images/" + uuid.v4());
      console.log(fileRef);
      const result = await uploadBytes(fileRef, blob);

      return await getDownloadURL(fileRef);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderBar
        title="Edit Profile"
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
      {/* Profile picture container */}
      <View style={styles.profile_picture_container}>
        <Image
          style={styles.profile_picture}
          source={{
            uri: profileUrl
              ? profileUrl
              : "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
          }}
        ></Image>
        <View
          style={{
            position: "absolute",
            transform: [{ translateX: 32 }],
            bottom: "0%",
            borderColor: "black",
            borderWidth: 1,
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              pickImage();
            }}
          >
            <Feather
              name="edit-2"
              size={20}
              style={{ marginVertical: 3, marginHorizontal: 4 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Display name container */}
      <View style={styles.display_name_container}>
        <Text style={styles.display_name_text}>{userProfile.display_name}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  profile_picture_container: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  profile_picture: {
    width: profileWidth,
    height: profileHeight,
    resizeMode: "stretch",
    borderColor: "#1E3765",
    borderWidth: 3,
    borderRadius: 20,
  },
  display_name_container: {
    paddingBottom: 16,
  },
  display_name_text: {
    fontWeight: 700,
    fontSize: 24,
  },
});

export default EditProfileScreen;
