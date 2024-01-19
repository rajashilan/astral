import FastImage from "react-native-fast-image";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Toast from "react-native-toast-message";
import { useSelector, useDispatch } from "react-redux";

import {
  createNotification,
  getClubGallery,
  handleDeleteClubGallery,
  setClubGalleryToFalse,
} from "../src/redux/actions/dataActions";
import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";
import EmptyView from "../components/EmptyView";

const { width } = Dimensions.get("window");

const ClubsGallery = React.memo(({ navigation, onScroll }) => {
  const dispatch = useDispatch();
  const club = useSelector((state) => state.data.clubData.club);
  const campusID = useSelector((state) => state.data.campus.campusID);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const gallery = useSelector((state) => state.data.clubData.gallery);
  const loading = useSelector((state) => state.data.loading);

  const [indexSelected, setIndexSelected] = useState(0);

  const [data, setData] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [galleryID, setDeleteGalleryID] = useState("");

  useEffect(() => {
    dispatch(getClubGallery(club.clubID));
  }, []);

  useEffect(() => {
    const temp = [];
    gallery.map((g) => {
      if (g.approval === "approved") temp.push(g);
      else if (
        g.approval !== "approved" &&
        !isEmpty(currentMember) &&
        currentMember.role === "president"
      )
        temp.push(g);
    });

    setData([...temp]);
  }, [gallery]);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const handleShowDeleteModal = (galleryID) => {
    if (galleryID) setDeleteGalleryID(galleryID);
    else setDeleteGalleryID("");

    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteGallery = () => {
    dispatch(handleDeleteClubGallery(galleryID, club.clubID, true));
    handleShowDeleteModal();
    //check if gallery length is 1
    //if it is, update clubs.gallery as false
    if (data.length === 1) {
      if (club.status === "active") {
        dispatch(setClubGalleryToFalse(club.clubID, campusID));
        const notification = {
          preText: "",
          postText: "has been deactivated due to insufficient details.",
          sourceID: club.clubID,
          sourceName: club.name,
          sourceImage: club.image,
          sourceDestination: "ClubsPages",
          defaultText: "",
          read: false,
          userID: "",
          createdAt: new Date().toISOString(),
          notificationID: "",
        };
        const userIDs = [];
        const temp = Object.values(club.roles);
        temp.forEach((role) => {
          if (role.userID && role.userID !== "") userIDs.push(role.userID);
        });

        dispatch(createNotification(notification, userIDs));
      }
    }
  };

  const handleScroll = (scrollHeight) => {
    onScroll(scrollHeight);
  };

  return (
    <ScrollView
      style={styles.container}
      scrollEventThrottle={16}
      onScroll={(event) => handleScroll(event.nativeEvent.contentOffset.y)}
    >
      {!isEmpty(currentMember) && currentMember.role === "president" && (
        <PrimaryButton
          onPress={() => {
            navigation.navigate("AddClubsGallery");
          }}
          text="add a photo"
          buttonStyle={{ marginTop: 0 }}
        />
      )}
      {!loading &&
        data.length === 0 &&
        !isEmpty(currentMember) &&
        currentMember.role === "president" && (
          <Text style={styles.warningText}>
            Please add a photo to be able to activate your club.
          </Text>
        )}
      <Pagination
        inactiveDotColor="#546593"
        dotColor="#C4FFF9"
        activeDotIndex={indexSelected}
        containerStyle={{
          paddingTop: 0,
          paddingRight: pixelSizeHorizontal(16),
          paddingLeft: pixelSizeHorizontal(16),
          paddingBottom: 0,
          marginBottom: pixelSizeVertical(12),
        }}
        dotsLength={data.length}
        inactiveDotScale={1}
      />
      <View style={{ flexDirection: row, justifyContent: "space-between" }}>
        <View
          style={{
            height: 10,
            width: 10,
            backgroundColor: "#546593",
            borderRadius: "50%",
          }}
        ></View>
        <View
          style={{
            height: 10,
            width: 10,
            backgroundColor: "#546593",
            borderRadius: "50%",
          }}
        ></View>
      </View>
      <Carousel
        layout="default"
        data={data}
        disableIntervalMomentum
        useExperimentalSnap
        onSnapToItem={(index) => onSelect(index)}
        sliderWidth={width - 32}
        itemWidth={width - 32}
        renderItem={({ item, index }) => (
          <>
            <Pressable
              onPress={() => {
                if (item.approval === "rejected")
                  navigation.navigate("ResubmitClubsGallery", {
                    gallery: item,
                  });
              }}
            >
              <FastImage
                key={index}
                style={
                  item.approval === "approved"
                    ? styles.image
                    : [styles.image, { opacity: 0.5 }]
                }
                resizeMode="cover"
                source={{ uri: item.image }}
                progressiveRenderingEnabled={true}
                cache={FastImage.cacheControl.immutable}
                priority={FastImage.priority.normal}
              />
              {item.title && (
                <Text
                  style={
                    item.approval === "approved"
                      ? styles.title
                      : item.approval === "rejected"
                        ? [styles.title, { color: "#A3222D" }]
                        : [styles.title, { opacity: 0.5 }]
                  }
                >
                  {item.title}
                </Text>
              )}
              {item.approval === "approved"
                ? item.content && (
                    <Text style={styles.content}>{item.content}</Text>
                  )
                : null}
              {!isEmpty(currentMember) &&
                currentMember.role === "president" &&
                item.approval === "approved" && (
                  <Pressable
                    style={styles.borderButton}
                    onPress={() => {
                      handleShowDeleteModal(item.galleryID);
                    }}
                  >
                    <Text style={styles.borderButtonText}>delete</Text>
                  </Pressable>
                )}
              {item.approval === "rejected" && (
                <>
                  <Text
                    style={{
                      fontSize: fontPixel(16),
                      fontWeight: "400",
                      color: "#A3222D",
                    }}
                  >
                    rejected
                  </Text>
                  <Text
                    style={{
                      fontSize: fontPixel(16),
                      fontWeight: "400",
                      color: "#C6CDE2",
                      marginTop: pixelSizeVertical(2),
                    }}
                  >
                    {item.rejectionReason}
                  </Text>
                </>
              )}
              {item.approval === "pending" && (
                <Text
                  style={{
                    fontSize: fontPixel(16),
                    fontWeight: "400",
                    color: "#C6CDE2",
                    marginTop: pixelSizeVertical(2),
                  }}
                >
                  pending approval
                </Text>
              )}
            </Pressable>
          </>
        )}
      />

      <Modal
        isVisible={showDeleteModal}
        onBackdropPress={() => setShowDeleteModal(!showDeleteModal)} // Android back press
        animationIn="bounceIn" // Has others, we want slide in from the left
        animationOut="bounceOut" // When discarding the drawer
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.withdrawPopupStyle} // Needs to contain the width, 75% of screen width in our case
      >
        <View style={styles.withdrawMenu}>
          <Text
            style={[
              styles.rejectionReason,
              { textAlign: "center", marginBottom: pixelSizeHorizontal(24) },
            ]}
          >
            {data.length === 1
              ? "Deleting this photo will set your club as inactive. Do you wish to continue?"
              : "Are you sure to delete this photo?"}
          </Text>
          <PrimaryButton
            loading={loading}
            onPress={handleDeleteGallery}
            text="delete"
          />
          {!loading && (
            <Pressable onPress={() => handleShowDeleteModal()}>
              <Text style={styles.withdrawButton}>cancel</Text>
            </Pressable>
          )}
        </View>
      </Modal>

      <EmptyView />
      <Toast config={toastConfig} />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingTop: pixelSizeVertical(14),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingBottom: pixelSizeVertical(12),
  },
  image: {
    width: "99%",
    height: 170,
    marginBottom: pixelSizeVertical(12),
    borderRadius: 5,
  },
  title: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(4),
  },
  content: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
  },
  onlySpan: {
    flexDirection: "row",
  },
  borderButton: {
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(24),
    width: "99%",
    borderRadius: 5,
    borderColor: "#C6CDE2",
    borderWidth: 1,
  },
  borderButtonText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#C6CDE2",
    textAlign: "center",
  },
  withdrawMenu: {
    height: "auto",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    backgroundColor: "#131A2E",
    display: "flex",
    borderRadius: 5,
  },
  rejectionReason: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
  },
  withdrawButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
  },
  warningText: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#C8A427",
  },
});

export default ClubsGallery;
