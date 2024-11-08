import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  Text,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import FastImage from "react-native-fast-image";
import * as Crypto from "expo-crypto";
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
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

export default function CreateAPhotosPost(props) {
  const { visibility } = props;

  const [indexSelected, setIndexSelected] = useState(0);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);

  const [errors, setErrors] = useState({});

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

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const handlePost = () => {
    //type text -> check if text is empty
    let tempErrors = {};
    if (images.length === 0) {
      tempErrors.post = "Add an image to post";
    } else if (images.length > 10) {
      tempErrors.post = "Please only add a maximum of 10 images";
    }

    if (!tempErrors.post) {
      uploadImagesAndGetUrls(images)
        .then(async (urls) => {
          let postData = {
            status: "active",
            postID: "", //update after adding to collection
            text: text,
            type: "photo", //photo, file, text, poll, ?event?
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
            photos: urls,
            likesCount: 0,
            commentsCount: 0,
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

  const handleAddPhoto = () => {
    if (images.length >= 10) {
      Toast.show({
        type: "error",
        text1: "you may only select a maximum of 10 images",
      });
      return;
    }
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      quality: 0.8,
      aspect: [1, 1],
      allowsMultipleSelection: true,
    })
      .then((result) => {
        if (!result.canceled) {
          // User picked an image
          let temp = [];
          result.assets.forEach((asset) => {
            const uri = asset.uri;
            const imageType = uri.split(".")[uri.split(".").length - 1];
            temp.push({ uri, imageType });
          });
          setImages([...images, ...temp]);
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

  const uploadImagesAndGetUrls = async (imageObjects) => {
    dispatch({ type: SET_LOADING_DATA });
    const uploadPromises = imageObjects.map(async ({ uri, imageType }) => {
      const name = Crypto.randomUUID();
      const imageFileName = `${name}.${imageType}`;
      const firebasePath = `clubs/gallery/photos/${data.clubID}/${imageFileName}`;

      // Upload image and get URL
      try {
        const blob = await uriToBlob(uri);
        await uploadToFirebase(blob, imageFileName);
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

  const uploadToFirebase = (blob, imageFileName) => {
    return new Promise((resolve, reject) => {
      const storageRef = storage().ref();

      storageRef
        .child(`clubs/gallery/photos/${data.clubID}/${imageFileName}`)
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
      {images.length > 0 ? (
        <>
          <View
            style={{
              marginVertical: pixelSizeVertical(24),
            }}
          >
            <Carousel
              layout="default"
              data={images}
              disableIntervalMomentum
              onSnapToItem={(index) => onSelect(index)}
              sliderWidth={width - 32}
              itemWidth={width - 32}
              useExperimentalSnap
              renderItem={({ item, index }) => (
                <>
                  <FastImage
                    key={index}
                    style={{
                      alignSelf: "center",
                      width: "100%",
                      height: heightPixel(300),
                      borderRadius: 5,
                    }}
                    transition={1000}
                    resizeMode="cover"
                    source={{ uri: item.uri }}
                    progressiveRenderingEnabled={true}
                    cache={FastImage.cacheControl.immutable}
                    priority={FastImage.priority.normal}
                  />
                </>
              )}
            />
          </View>
          <Pagination
            inactiveDotColor="#546593"
            dotColor="#C4FFF9"
            activeDotIndex={indexSelected}
            containerStyle={{
              paddingTop: 0,
              paddingBottom: 0,
              alignSelf: "center",
              marginTop: pixelSizeVertical(12),
              marginBottom: pixelSizeVertical(24),
            }}
            dotsLength={images.length}
            inactiveDotScale={1}
          />
        </>
      ) : (
        <View
          style={{
            marginBottom: pixelSizeVertical(20),
          }}
        ></View>
      )}
      <Pressable
        onPress={handleAddPhoto}
        style={{
          backgroundColor: "#232F52",
          paddingVertical: pixelSizeVertical(16),
          paddingHorizontal: pixelSizeHorizontal(16),
          borderRadius: 5,
          width: "40%",
        }}
      >
        <Text
          style={{
            fontSize: fontPixel(14),
            fontWeight: "400",
            color: "#DFE5F8",
          }}
        >
          Choose photos
        </Text>
      </Pressable>
      {images.length > 0 ? (
        <Pressable
          onPress={() => {
            setImages([]);
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
            Reset photos
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
  );
}
