import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderBar from "../components/HeaderBar";
import { Ionicons, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import api from "../helpers/API";
const { DateTime } = require("luxon");

const CreateEditEventScreen = function ({ navigation, route }) {
  // Signifies from where we navigate to this screen
  const { isCreate = false, eventObject } = route?.params ? route?.params : {};
  const dispatchRedux = useDispatch();
  const primaryColor = useSelector((state) => state.main.primaryColor);
  const secondaryColor = useSelector((state) => state.main.secondaryColor);
  const contrastColor = useSelector((state) => state.main.contrastColor);

  const userProfileRedux = useSelector((state) => state.userProfileData);

  const [img, setImg] = useState(eventObject?._images?._header_image);
  const [title, setTitle] = useState(eventObject?._event_title);
  const [location, setLocation] = useState(eventObject?._location);
  const [description, setDescription] = useState(eventObject?._description);
  const [startTime, setStartTime] = useState(
    eventObject?._event_start_time
      ? new Date(eventObject?._event_start_time)
      : new Date(),
  );
  const [endTime, setEndTime] = useState(
    eventObject?._event_end_time
      ? new Date(eventObject?._event_end_time)
      : new Date(),
  );
  const [expiryTime, setExpiryTime] = useState(
    eventObject?._event_expiry_time
      ? new Date(eventObject?._event_expiry_time)
      : new Date(),
  );

  const refTitleInput = useRef();
  const refLocationInput = useRef();
  const refDescriptionInput = useRef();

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled === true) return;

    // console.log(pickerResult.assets[0].uri);
    setImg(pickerResult.assets[0].uri);
  };

  // TODO: Set correct image when sending to api
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedToSubmit, setFailedToSubmit] = useState(false);

  const sendEvent = async () => {
    setIsSubmitting(true);

    const startTimeString = DateTime.fromJSDate(startTime, {
      zone: "America/Toronto",
    }).toISO();
    const endTimeString = DateTime.fromJSDate(endTime, {
      zone: "America/Toronto",
    }).toISO();
    const expiryTimeString = DateTime.fromJSDate(expiryTime, {
      zone: "America/Toronto",
    }).toISO();

    const newEventObj = {
      _creator_id: userProfileRedux?.uid,
      _event_title: title,
      _location: location,
      _event_start_time: startTimeString,
      _event_end_time: endTimeString,
      _description: description,
      _images: { _header_image: img },
      _event_expiry_time: expiryTimeString,
    };

    let response;
    if (isCreate) {
      response = await api.createEvent(newEventObj);
    } else {
      response = await api.editEvent(
        (data = newEventObj),
        (id = eventObject?._event_id),
      );
    }

    if (response.result == "SUCCESSFUL") {
      // Event created
      setFailedToSubmit(false);
      navigation.goBack();
    } else {
      // Event cannot be created
      setFailedToSubmit(true);
    }
    setIsSubmitting(false);
  };

  return (
    <View>
      <HeaderBar
        title={isCreate ? "Create Event" : "Edit Event"}
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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={{ marginBottom: 100 }}>
          {/* Image */}
          <TouchableOpacity onPress={openImagePickerAsync}>
            <Image
              style={{
                height: 300,
                resizeMode: "contain",
                justifyContent: "center",
                alignItems: "center",
              }}
              source={{
                uri: img ? img : "https://picsum.photos/390/300",
              }}
            />
          </TouchableOpacity>

          {/* Title Input */}
          <Text style={styles.titleStyle}>Title</Text>
          <TextInput
            ref={refTitleInput}
            selectTextOnFocus={true}
            style={{ ...styles.textInput, backgroundColor: contrastColor }}
            autoCorrect={false}
            value={title}
            returnKeyType="next"
            clearButtonMode="while-editing"
            onChangeText={setTitle}
            onSubmitEditing={() => {
              if (!location) refLocationInput?.current?.focus();
            }}
            onBlur={() => {}}
          />

          {/* Location Input */}
          <Text style={styles.titleStyle}>Location</Text>
          <TextInput
            ref={refLocationInput}
            selectTextOnFocus={true}
            style={{ ...styles.textInput, backgroundColor: contrastColor }}
            autoCorrect={false}
            value={location}
            // returnKeyType="next"
            clearButtonMode="while-editing"
            onChangeText={setLocation}
            // onSubmitEditing={() => {}}
            // onBlur={() => {}}
          />

          {/* Start time */}
          <Text style={styles.titleStyle}>Start Time</Text>
          <DateTimePicker
            value={startTime}
            onChange={(event, date) => {
              if (event.type == "set") {
                setStartTime(date);
              }
            }}
            mode="datetime"
            minimumDate={new Date()}
            style={{ alignSelf: "center" }}
            timeZoneName="America/Toronto"
            accentColor={primaryColor}
          />

          {/* End time */}
          <Text style={styles.titleStyle}>End Time</Text>
          <DateTimePicker
            value={endTime}
            onChange={(event, date) => {
              if (event.type == "set") {
                setEndTime(date);
              }
            }}
            mode="datetime"
            minimumDate={startTime}
            style={{ alignSelf: "center" }}
            timeZoneName="America/Toronto"
            accentColor={primaryColor}
          />

          {/* Description Input */}
          <Text style={styles.titleStyle}>Description</Text>
          <TextInput
            ref={refDescriptionInput}
            selectTextOnFocus={true}
            style={{
              ...styles.textInput,
              height: 120,
              backgroundColor: contrastColor,
            }}
            multiline={true}
            autoCorrect={false}
            value={description}
            clearButtonMode="while-editing"
            onChangeText={setDescription}
            // onSubmitEditing={() => {}}
            // onBlur={() => {}}
          />

          {/* Expiry Time */}
          <Text style={styles.titleStyle}>Expiry Time (Optional)</Text>
          <DateTimePicker
            value={expiryTime}
            onChange={(event, date) => {
              if (event.type == "set") {
                setExpiryTime(date);
              }
            }}
            mode="datetime"
            minimumDate={endTime}
            style={{ alignSelf: "center" }}
            timeZoneName="America/Toronto"
            accentColor={primaryColor}
          />
          {isSubmitting ? (
            <View
              style={{ ...styles.createButton, backgroundColor: primaryColor }}
            >
              <ActivityIndicator color="white" />
            </View>
          ) : (
            <TouchableOpacity
              style={{ ...styles.createButton, backgroundColor: primaryColor }}
              onPress={sendEvent}
            >
              <Text style={{ color: contrastColor, fontSize: 16 }}>
                {isCreate ? "Create" : "Submit"}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    marginHorizontal: 36,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  titleStyle: {
    fontWeight: "bold",
    marginHorizontal: 44,
    marginBottom: 8,
    marginTop: 16,
  },
  createButton: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 50,
    alignSelf: "center",
    borderRadius: 24,
    marginBottom: 80,
  },
});

export default CreateEditEventScreen;
