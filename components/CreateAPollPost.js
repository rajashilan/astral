import React, { useState } from "react";
import { View, Dimensions, Pressable, Text } from "react-native";
import storage from "@react-native-firebase/storage";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost } from "../src/redux/actions/dataActions";
import PrimaryButton from "./PrimaryButton";
import EmptyView from "./EmptyView";
import CustomTextInput from "./CustomTextInput";
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";
import CloseIcon from "../assets/close_icon_gray.png";
import FastImage from "react-native-fast-image";
const { width } = Dimensions.get("window");

export default function CreateAPollPost(props) {
  const { visibility } = props;

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

  const [pollText, setPollText] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const [poll, setPoll] = useState({
    options: [
      { optionID: 0, votes: 0 },
      { optionID: 1, votes: 0 },
    ],
  });

  const [text, setText] = useState("");

  const [errors, setErrors] = useState({});

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const handleSetPollOptionText = (index, text) => {
    setPollText((prevPollText) => ({
      ...prevPollText,
      [index]: text,
    }));
  };

  const handleAddOption = () => {
    if (poll.options.length > 4) return;

    let temp = [...poll.options];
    temp.push({
      optionID: poll.options.length,
      votes: 0,
    });

    setPoll({
      options: [...temp],
    });
  };

  const handleRemoveOption = (index) => {
    //reset text for the option's index
    //remove option from poll options
    handleSetPollOptionText(index, "");
    let temp = [...poll.options];
    temp.splice(index, 1);
    setPoll({
      options: [...temp],
    });
  };

  const handlePost = async () => {
    let tempErrors = {};
    poll.options.forEach((option) => {
      if (pollText[option.optionID].trim() === "") {
        tempErrors.post = "Please fill up all choices to post";
      }
    });

    if (!tempErrors.post) {
      let postData = {
        status: "active",
        postID: "", //update after adding to collection
        text: text,
        type: "poll", //photo, file, text, poll, ?event?
        createdBy: user.userId,
        createdByUsername: user.username,
        createdByRole: currentMember.role,
        createdByImageUrl: user.profileImage,
        createdAt: new Date().toISOString(),
        clubID: data.clubID,
        clubName: data.name,
        clubImageUrl: data.image,
        campusID: data.campusID,
        visibility: visibility,
        options: [],
        votes: {},
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), //expires in 24 hours
        likesCount: 0,
        commentsCount: 0,
      };
      poll.options.forEach((option) => {
        postData.options.push({
          optionID: option.optionID,
          votes: 0,
          text: pollText[option.optionID],
        });
      });
      try {
        await dispatch(addNewPost(postData));
        props.callParentScreenFunction();
      } catch (error) {
        console.error(error);
      }
    }

    setErrors(tempErrors);
  };

  return (
    <View
      style={{
        marginTop: pixelSizeVertical(14),
      }}
    >
      <CustomTextInput
        placeholder={`create a ${visibility} poll...`}
        value={text}
        multiline={true}
        numberOfLines={4}
        editable={!loading}
        onChangeText={(text) => setText(text)}
      />
      <View
        style={{
          marginTop: pixelSizeVertical(24),
        }}
      >
        <View
          style={{
            borderStyle: "solid",
            borderRadius: 5,
            borderColor: "#35436C",
            borderWidth: 1,
            paddingTop: pixelSizeVertical(6),
            paddingBottom: pixelSizeVertical(16),
            paddingHorizontal: pixelSizeHorizontal(8),
            flexDirection: "column",
          }}
        >
          <View
            style={{
              flexDirection: "column",
            }}
          >
            {poll.options.map((option, index) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <CustomTextInput
                    placeholder={`Choice ${index + 1}`}
                    value={pollText[index]}
                    multiline={true}
                    numberOfLines={4}
                    editable={!loading}
                    inputStyle={{
                      width: "85%",
                    }}
                    onChangeText={(text) =>
                      handleSetPollOptionText(index, text)
                    }
                  />
                  {index === poll.options.length - 1 && index > 1 ? (
                    <Pressable
                      onPress={() => handleRemoveOption(index)}
                      style={{
                        marginTop: pixelSizeVertical(8),
                        marginLeft: pixelSizeHorizontal(5),
                      }}
                      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                      <FastImage
                        style={{
                          height: pixelSizeVertical(20),
                          width: pixelSizeHorizontal(35),
                        }}
                        source={CloseIcon}
                        resizeMode="contain"
                      />
                    </Pressable>
                  ) : null}
                </View>
              );
            })}
          </View>
          {poll.options.length < 4 ? (
            <Pressable
              onPress={handleAddOption}
              style={{
                backgroundColor: "#232F52",
                paddingVertical: pixelSizeVertical(16),
                paddingHorizontal: pixelSizeHorizontal(16),
                borderRadius: 5,
                width: "40%",
                marginTop: pixelSizeVertical(20),
              }}
            >
              <Text
                style={{
                  fontSize: fontPixel(14),
                  fontWeight: "400",
                  color: "#DFE5F8",
                }}
              >
                Add an option
              </Text>
            </Pressable>
          ) : null}
        </View>
        <Text
          style={{
            fontSize: fontPixel(12),
            fontWeight: "400",
            color: "#A7AFC7",
            marginVertical: pixelSizeVertical(14),
            paddingLeft: pixelSizeHorizontal(16),
          }}
        >
          *poll will end in 24 hours from time of creation
        </Text>
        {errors.post ? (
          <Text
            style={{
              marginBottom: pixelSizeVertical(8),
              fontSize: fontPixel(12),
              fontWeight: "400",
              color: "#B1121F",
              paddingLeft: pixelSizeHorizontal(16),
              paddingRight: pixelSizeHorizontal(16),
            }}
          >
            {errors.post}
          </Text>
        ) : null}
        <PrimaryButton loading={loading} onPress={handlePost} text="post" />
        <Toast config={toastConfig} />
      </View>
    </View>
  );
}
