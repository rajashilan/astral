import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from "../utils/responsive-font";
import Modal from "react-native-modal";
import IosHeight from "./IosHeight";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import CustomTextInput from "./CustomTextInput";
import PrimaryButton from "./PrimaryButton";
import CustomSelectDropdown from "./CustomSelectDropdown";
import * as Crypto from "expo-crypto";
import { addNewPost } from "../src/redux/actions/dataActions";
import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";
import { StatusBar } from "expo-status-bar";
import EmptyView from "./EmptyView";
import CreateAPhotosPost from "./CreateAPhotosPost";
import CreateAFilePost from "./CreateAFilePost";
import WarningDot from "../assets/WarningDot";
import CreateAPollPost from "./CreateAPollPost";

export default function CreateAPostModal(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.credentials);
  const data = useSelector((state) => state.data.clubData.club);
  const campusID = useSelector((state) => state.data.campus.campusID);
  const loading = useSelector((state) => state.data.loading);
  const UIloading = useSelector((state) => state.UI.loading);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const members = useSelector((state) => state.data.clubData.members);

  //photos, events, poll, files
  const [selectedOption, setSelectedOption] = useState("text");

  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [poll, setPoll] = useState({});

  const [errors, setErrors] = useState({});

  const [visibility, setVisibility] = useState("public");
  const [visibilityOptions] = useState(["public", "private"]);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [isVisibilityChanged, setIsVisibilityChanged] = useState(false);
  const visibilityDropDown = useRef(null);

  const [text, setText] = useState("");

  const handlePost = () => {
    //type text -> check if text is empty
    let tempErrors = {};
    if (text.trim() === "" && selectedOption === "text") {
      tempErrors.post = "Please type something to post";
    }

    if (!tempErrors.post) {
      let postData;
      if (selectedOption === "text") {
        postData = {
          postID: "", //update after adding to collection
          text: text,
          type: selectedOption, //photo, file, text, poll, ?event?
          createdBy: user.userId,
          createdByUsername: user.username,
          createdByRole: currentMember.role,
          createdAt: new Date().toISOString(),
          clubID: data.clubID,
          clubName: data.name,
          clubImageUrl: data.image,
          campusID: data.campusID,
          visibility: visibility,
        };
      }
      dispatch(addNewPost(postData));
    }

    setErrors(tempErrors);
  };

  //when an option is selected or unselected, reset all data, excluding text
  const handleSelectOption = (option) => {
    if (option === selectedOption) {
      setSelectedOption("text");
    } else {
      setSelectedOption(option);
    }
    resetOptions();
  };

  const resetOptions = () => {
    setImages([]);
    setFile(null);
    setPoll({});
  };

  useEffect(() => {
    return () => {
      setText("");
      resetOptions();
    };
  }, []);

  const toggleVisibilityModal = () => {
    setIsVisibilityChanged(false);
    setShowVisibilityModal(!showVisibilityModal);
  };

  const resetVisibilityDropdown = () => {
    setVisibility("public");
    visibilityDropDown.current.reset();
  };

  const textPost = (
    <>
      <CustomTextInput
        placeholder={`create a ${visibility} post...`}
        value={text}
        multiline={true}
        numberOfLines={4}
        editable={!loading}
        onChangeText={(text) => setText(text)}
      />
      {errors.post ? (
        <Text
          style={{
            marginTop: pixelSizeVertical(8),
            marginBottom: pixelSizeVertical(8),
            fontSize: fontPixel(12),
            fontWeight: "400",
            color: "#ed3444",
            paddingLeft: pixelSizeHorizontal(16),
            paddingRight: pixelSizeHorizontal(16),
          }}
        >
          {errors.post}
        </Text>
      ) : null}
      <PrimaryButton loading={loading} onPress={handlePost} text="post" />
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#0C111F",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: pixelSizeHorizontal(16),
        flexDirection: "column",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
    >
      <IosHeight />
      <View
        style={{
          height: heightPixel(2),
          backgroundColor: "#F5ECEC",
          borderRadius: 5,
          width: "50%",
          alignSelf: "center",
          marginBottom: pixelSizeVertical(30),
        }}
      />
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontSize: fontPixel(16),
            fontWeight: "500",
            color: "#DFE5F8",
          }}
        >
          {data.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: pixelSizeVertical(14),
            alignItems: "center",
          }}
        >
          <FastImage
            style={{
              width: widthPixel(40),
              height: heightPixel(40),
              marginTop: "auto",
              marginBottom: "auto",
              borderRadius: 50,
            }}
            resizeMode="cover"
            source={{ uri: currentMember.profileImage }}
            progressiveRenderingEnabled={true}
            cache={FastImage.cacheControl.immutable}
            priority={FastImage.priority.normal}
          />
          <View
            style={{
              flexDirection: "column",
              marginLeft: pixelSizeHorizontal(5),
            }}
          >
            <Text
              style={{
                fontSize: fontPixel(14),
                fontWeight: "500",
                color: "#DFE5F8",
              }}
            >
              @{user.username}
            </Text>
            <Text
              style={{
                fontSize: fontPixel(14),
                fontWeight: "400",
                color: "#C6CDE2",
                marginLeft: pixelSizeHorizontal(2),
              }}
            >
              {currentMember.role}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal={true}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            backgroundColor: "#0C111F",
            maxHeight: heightPixel(65),
          }}
        >
          {/* --------------------------------------------- start of visibility options */}
          <Pressable
            style={{
              paddingVertical: pixelSizeVertical(8),
              paddingHorizontal: pixelSizeHorizontal(12),
              backgroundColor: "#232F52",
              marginHorizontal: pixelSizeHorizontal(4),
              borderRadius: 5,
              marginTop: pixelSizeVertical(16),
              marginBottom: pixelSizeVertical(16),
            }}
            onPress={toggleVisibilityModal}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: fontPixel(14),
                  fontWeight: "500",
                  textAlign: "center",
                  color: "#DFE5F8",
                }}
              >
                {visibility}
              </Text>
              <WarningDot
                style={{
                  marginBottom: pixelSizeVertical(-12),
                  marginRight: pixelSizeHorizontal(1),
                }}
              />
            </View>
          </Pressable>
          {/* --------------------------------------------- start of photos option */}
          <Pressable
            style={{
              paddingVertical: pixelSizeVertical(8),
              paddingHorizontal: pixelSizeHorizontal(12),
              backgroundColor:
                selectedOption === "photos" ? "#6072A5" : "#232F52",
              marginHorizontal: pixelSizeHorizontal(4),
              borderRadius: 5,
              marginTop: pixelSizeVertical(16),
              marginBottom: pixelSizeVertical(16),
            }}
            onPress={() => {
              handleSelectOption("photos");
            }}
          >
            <Text
              style={{
                fontSize: fontPixel(14),
                fontWeight: "500",
                textAlign: "center",
                color: "#DFE5F8",
              }}
            >
              photos
            </Text>
          </Pressable>
          {/* --------------------------------------------- start of events option */}
          <Pressable
            style={{
              paddingVertical: pixelSizeVertical(8),
              paddingHorizontal: pixelSizeHorizontal(12),
              backgroundColor:
                selectedOption === "events" ? "#6072A5" : "#232F52",
              marginHorizontal: pixelSizeHorizontal(4),
              borderRadius: 5,
              marginTop: pixelSizeVertical(16),
              marginBottom: pixelSizeVertical(16),
            }}
            onPress={() => {
              handleSelectOption("events");
            }}
          >
            <Text
              style={{
                fontSize: fontPixel(14),
                fontWeight: "500",
                textAlign: "center",
                color: "#DFE5F8",
              }}
            >
              events
            </Text>
          </Pressable>
          {/* --------------------------------------------- start of poll option */}
          <Pressable
            style={{
              paddingVertical: pixelSizeVertical(8),
              paddingHorizontal: pixelSizeHorizontal(12),
              backgroundColor:
                selectedOption === "poll" ? "#6072A5" : "#232F52",
              marginHorizontal: pixelSizeHorizontal(4),
              borderRadius: 5,
              marginTop: pixelSizeVertical(16),
              marginBottom: pixelSizeVertical(16),
            }}
            onPress={() => {
              handleSelectOption("poll");
            }}
          >
            <Text
              style={{
                fontSize: fontPixel(14),
                fontWeight: "500",
                textAlign: "center",
                color: "#DFE5F8",
              }}
            >
              poll
            </Text>
          </Pressable>
          {/* --------------------------------------------- start of files option */}
          <Pressable
            style={{
              paddingVertical: pixelSizeVertical(8),
              paddingHorizontal: pixelSizeHorizontal(12),
              backgroundColor:
                selectedOption === "file" ? "#6072A5" : "#232F52",
              marginHorizontal: pixelSizeHorizontal(4),
              borderRadius: 5,
              marginTop: pixelSizeVertical(16),
              marginBottom: pixelSizeVertical(16),
            }}
            onPress={() => {
              handleSelectOption("file");
            }}
          >
            <Text
              style={{
                fontSize: fontPixel(14),
                fontWeight: "500",
                textAlign: "center",
                color: "#DFE5F8",
              }}
            >
              file
            </Text>
          </Pressable>
          {/* --------------------------------------------- start of extra */}
          <Pressable
            style={{
              paddingVertical: pixelSizeVertical(8),
              paddingHorizontal: pixelSizeHorizontal(12),
              backgroundColor: "#232F52",
              marginHorizontal: pixelSizeHorizontal(4),
              borderRadius: 5,
              marginTop: pixelSizeVertical(16),
              marginBottom: pixelSizeVertical(16),
              opacity: 0,
            }}
            onPress={() => {}}
          >
            <Text
              style={{
                fontSize: fontPixel(14),
                fontWeight: "500",
                textAlign: "center",
                color: "#DFE5F8",
              }}
            >
              extra
            </Text>
          </Pressable>
        </ScrollView>

        {selectedOption === "text" ? textPost : null}
        {selectedOption === "photos" ? (
          <CreateAPhotosPost visibility={visibility} />
        ) : null}
        {selectedOption === "file" ? (
          <CreateAFilePost visibility={visibility} />
        ) : null}
        {selectedOption === "poll" ? (
          <CreateAPollPost visibility={visibility} />
        ) : null}

        {!loading && (
          <Pressable onPress={props.callParentScreenFunction}>
            <Text
              style={{
                fontSize: fontPixel(16),
                fontWeight: "400",
                color: "#A7AFC7",
                marginTop: pixelSizeVertical(2),
                textAlign: "center",
              }}
            >
              back
            </Text>
          </Pressable>
        )}
        <EmptyView />
        <EmptyView />
      </ScrollView>

      <Modal
        isVisible={showVisibilityModal}
        onBackdropPress={toggleVisibilityModal} // Android back press
        animationIn="bounceIn" // Has others, we want slide in from the left
        animationOut="bounceOut" // When discarding the drawer
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
      >
        <View
          style={{
            height: "auto",
            paddingVertical: pixelSizeVertical(16),
            paddingHorizontal: pixelSizeHorizontal(16),
            backgroundColor: "#131A2E",
            display: "flex",
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontPixel(20),
              fontWeight: "400",
              color: "#DFE5F8",
              marginBottom: pixelSizeVertical(12),
              textAlign: "center",
            }}
          >
            Select your post's visbility
          </Text>
          <CustomSelectDropdown
            data={visibilityOptions}
            onSelect={(selectedItem, index) => {
              if (!isVisibilityChanged) {
                setIsVisibilityChanged(true);
              }
              setVisibility(selectedItem);
            }}
            defaultText={visibility}
            loading={loading}
            ref={visibilityDropDown}
            customDropdownButtonStyle={{
              backgroundColor: "#212A46",
            }}
          />
          {!loading && (
            <Pressable onPress={toggleVisibilityModal}>
              <Text
                style={{
                  fontSize: isVisibilityChanged ? fontPixel(18) : fontPixel(16),
                  fontWeight: isVisibilityChanged ? "500" : "400",
                  color: isVisibilityChanged ? "#DFE5F8" : "#A7AFC7",
                  marginTop: pixelSizeVertical(16),
                  textAlign: "center",
                }}
              >
                {isVisibilityChanged ? "done" : "back"}
              </Text>
            </Pressable>
          )}
        </View>
      </Modal>
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </KeyboardAvoidingView>
  );
}
