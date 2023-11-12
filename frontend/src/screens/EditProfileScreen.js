import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  TextInput,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderBar from "../components/HeaderBar";
import PopUp from "../components/PopUp";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import api from "../helpers/API";
import { setUserProfileData } from "../store/Action";

// style consts
const profileHeight = 80;
const profileWidth = 80;

const EditProfileScreen = function ({ navigation, route }) {
  const { userProfile } = route.params;
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  const [profileUrl, setProfileUrl] = useState(userProfile?.photo_url);
  const [displayName, setDisplayName] = useState(userProfile?.display_name);
  const [editPopup, setEditPopup] = useState(false);
  const [editText, setEditText] = useState(userProfile?.display_name);

  const callEditUserProfile = ({ uid, display_name, photo_url }) => {
    data = {
      uid: uid,
      display_name: display_name,
      photo_url: photo_url,
    };
    api.editUserProfile(data).then((response) => {
      if (response.result == "SUCCESSFUL") {
        // do something if profile screen set successfully
        // update user profile data
        data = {
          ...data,
          email: userProfile.email,
          is_admin: userProfile.is_admin,
        };
        dispatchRedux(setUserProfileData(data));
        // console.log(userProfileSelector);
      }
    });
  };

  const pickImage = () => {
    // No permissions request is necessary for launching the image library
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }).then(async (pickerResult) => {
      if (!pickerResult.canceled) {
        const uploadUrl = await uploadImageAsync(pickerResult.assets[0].uri);
        // handle uploadUrl has desired
        setProfileUrl(uploadUrl);
        // call edit profile
        callEditUserProfile({
          uid: userProfile.uid,
          display_name: userProfile.display_name,
          photo_url: uploadUrl,
        });
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
        <TouchableOpacity
          onPress={() => {
            pickImage();
          }}
        >
          <Image
            style={styles.profile_picture}
            source={{
              uri: profileUrl
                ? profileUrl
                : "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
            }}
          ></Image>
        </TouchableOpacity>
        <View
          style={{
            ...styles.edit_button_container,
            backgroundColor: primaryColor,
            bottom: "0%",
            transform: [{ translateX: 32 }],
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
              color={contrastColor}
              style={{ marginVertical: 3, marginHorizontal: 4 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Display name container */}
      <View style={styles.display_name_container}>
        <Text style={styles.display_name_text}>{displayName}</Text>
        <View
          style={{
            ...styles.edit_button_container,
            backgroundColor: primaryColor,
            right: "5%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setEditPopup(true);
            }}
          >
            <Feather
              name="edit-2"
              size={20}
              color={contrastColor}
              style={{
                marginVertical: 3,
                marginHorizontal: 4,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <PopUp
        visible={editPopup}
        setVisible={setEditPopup}
        onClose={() => {
          setEditText(displayName);
        }}
      >
        <TextInput
          value={editText}
          onChangeText={(text) => {
            setEditText(text);
          }}
          style={{ ...styles.input, borderColor: primaryColor }}
          autoFocus
          selectTextOnFocus
          multiline
          placeholder="Enter description"
          placeholderTextColor={"grey"}
        />
        <TouchableOpacity
          style={styles.done_editing_button}
          onPress={() => {
            // only edit description if text has changed
            if (editText != displayName) {
              setDisplayName(editText);
              callEditUserProfile({
                uid: userProfile.uid,
                display_name: editText,
                photo_url: userProfile.photo_url,
              });
              setEditPopup(false);
            } else {
              setEditPopup(false);
            }
          }}
        >
          <Text style={styles.done_editing_text}>DONE</Text>
        </TouchableOpacity>
      </PopUp>
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
  edit_button_container: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: "50%",
    position: "absolute",
  },
  display_name_container: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  display_name_text: {
    fontWeight: 700,
    fontSize: 24,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 3,
    outlineStyle: "none",
    width: "calc(100% - 24px)",
  },
  done_editing_button: {
    backgroundColor: "#16aed9",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  done_editing_text: {
    fontWeight: 700,
    color: "white",
  },
});

export default EditProfileScreen;
