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
import { SET_LOADING_DATA } from "../src/redux/type";
const { width } = Dimensions.get("window");

export default function CreateAFilePost(props) {
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

  const [file, setFile] = useState({});

  const [text, setText] = useState("");

  const [errors, setErrors] = useState({});

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const handlePost = () => {
    let tempErrors = {};
    if (isEmpty(file)) {
      tempErrors.post = "Add a file to post";
    }

    if (!tempErrors.post) {
      uploadFileAndGetUrl([{ ...file }])
        .then(async (url) => {
          let postData = {
            postID: "", //update after adding to collection
            text: text,
            type: "file", //photo, file, text, poll, ?event?
            createdBy: user.userId,
            createdByUsername: user.username,
            createdByRole: currentMember.role,
            createdAt: new Date().toISOString(),
            clubID: data.clubID,
            clubName: data.name,
            clubImageUrl: data.image,
            campusID: data.campusID,
            visibility: visibility,
            file: {
              name: file.name,
              url: url[0],
            },
          };
          try {
            await dispatch(addNewPost(postData));
            props.callParentScreenFunction();
          } catch (error) {
            console.error(error);
          }
        })
        .catch((error) => {
          console.error("Error uploading images:", error);
          Toast.show({
            type: "error",
            text1: "something went wrong",
          });
        });
    }

    setErrors(tempErrors);
  };

  const handleAddFile = () => {
    DocumentPicker.getDocumentAsync({
      allowsMultipleSelection: false,
    })
      .then((result) => {
        if (!result.canceled) {
          // User picked a file
          const uri = result.assets[0].uri;
          const fileType = uri.split(".")[uri.split(".").length - 1];
          const name = result.assets[0].name;
          setFile({ uri, fileType, name });
        }
      })
      .catch((error) => {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "something went wrong",
        });
      });
  };

  const uploadFileAndGetUrl = async (imageObjects) => {
    dispatch({ type: SET_LOADING_DATA });
    const uploadPromises = imageObjects.map(async ({ uri, fileType, name }) => {
      const fileName = `${name}.${fileType}`;
      const firebasePath = `clubs/files/${data.clubID}/${fileName}`;

      // Upload image and get URL
      try {
        const blob = await uriToBlob(uri);
        await uploadToFirebase(blob, fileName);
        return await storage().ref(firebasePath).getDownloadURL();
      } catch (error) {
        console.error(`Error uploading image: ${error.message}`);
        throw error; // Optionally rethrow or handle errors differently
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error_1) {
      // Handle any error that occurred in the process
      console.error(`Error in uploading images: ${error_1.message}`);
      throw error_1; // Handle or rethrow as needed
    }
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error("uriToBlob failed"));
      };
      // this helps us get a blob
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);

      xhr.send(null);
    });
  };

  const uploadToFirebase = (blob, fileName) => {
    return new Promise((resolve, reject) => {
      const storageRef = storage().ref();

      storageRef
        .child(`clubs/files/${data.clubID}/${fileName}`)
        .put(blob)
        .then((snapshot) => {
          blob.close();
          resolve(snapshot);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <View
      style={{
        marginTop: pixelSizeVertical(14),
      }}
    >
      <CustomTextInput
        placeholder={`create a ${visibility} post...`}
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
        {!isEmpty(file) ? (
          <Text
            style={{
              fontSize: fontPixel(22),
              fontWeight: "500",
              color: "#BE5007",
              marginTop: pixelSizeVertical(-10),
              marginBottom: pixelSizeVertical(16),
              textDecorationLine: "underline",
            }}
          >
            {file.name}
          </Text>
        ) : null}
        <Pressable
          onPress={handleAddFile}
          style={{
            backgroundColor: "#232F52",
            paddingVertical: pixelSizeVertical(16),
            paddingHorizontal: pixelSizeHorizontal(16),
            borderRadius: 5,
            width: "35%",
          }}
        >
          <Text
            style={{
              fontSize: fontPixel(14),
              fontWeight: "400",
              color: "#DFE5F8",
            }}
          >
            Choose a file
          </Text>
        </Pressable>
        {!isEmpty(file) ? (
          <Pressable
            onPress={() => {
              setFile({});
            }}
            style={{
              marginVertical: pixelSizeVertical(15),
            }}
          >
            <Text
              style={{
                fontSize: fontPixel(14),
                fontWeight: "400",
                color: "#A7AFC7",
                marginLeft: pixelSizeHorizontal(16),
              }}
            >
              Clear file
            </Text>
          </Pressable>
        ) : null}
        {errors.post ? (
          <Text
            style={{
              marginTop: pixelSizeVertical(8),
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
