import dayjs from "dayjs";
import FastImage from "react-native-fast-image";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import Modal from "react-native-modal";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Toast from "react-native-toast-message";
import { useSelector, useDispatch } from "react-redux";

import {
  createNotification,
  getClubEvent,
  handleDeleteClubEvent,
  setClubEventToFalse,
} from "../src/redux/actions/dataActions";
import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";

const { width } = Dimensions.get("window");

const ClubsEvents = React.memo(({ navigation }) => {
  //can have image, must have title, must have date, can have text

  const [innerTab, setInnerTab] = useState("past");

  const dispatch = useDispatch();

  const events = useSelector((state) => state.data.clubData.event);
  const club = useSelector((state) => state.data.clubData.club);
  const campusID = useSelector((state) => state.data.campus.campusID);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const loading = useSelector((state) => state.data.loading);

  const [indexSelected, setIndexSelected] = useState(0);

  const [data, setData] = useState({
    past: [],
    future: [],
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventID, setEventID] = useState("");

  useEffect(() => {
    dispatch(getClubEvent(club.clubID));
  }, []);

  useEffect(() => {
    //perform filtering according to past and future
    //also perform filtering for approval and member role
    let currentDate = new Date().toISOString();
    currentDate = currentDate.split("T")[0];
    const tempPast = [];
    const tempFuture = [];

    events.map((event) => {
      if (event.date.split("T")[0] < currentDate) {
        if (event.approval === "approved") tempPast.push(event);
        else if (
          event.approval !== "approved" &&
          !isEmpty(currentMember) &&
          currentMember.role === "president"
        )
          tempPast.push(event);
      } else {
        if (event.approval === "approved") tempFuture.push(event);
        else if (
          event.approval !== "approved" &&
          !isEmpty(currentMember) &&
          currentMember.role === "president"
        )
          tempFuture.push(event);
      }
    });
    setData({
      past: [...tempPast],
      future: [...tempFuture],
    });
  }, [events]);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const handleShowDeleteModal = (eventID) => {
    if (eventID) setEventID(eventID);
    else setEventID("");

    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteEvent = () => {
    dispatch(handleDeleteClubEvent(eventID, club.clubID, true));
    handleShowDeleteModal();
    //check if event length is 1
    //if it is, update clubs.events as false
    if (data.past.length + data.future.length === 1) {
      if (club.status === "active") {
        dispatch(setClubEventToFalse(club.clubID, campusID));
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

  return (
    <View style={styles.container}>
      {!isEmpty(currentMember) && currentMember.role === "president" && (
        <Pressable
          style={styles.loginButton}
          onPress={() => {
            navigation.navigate("AddClubsEvent");
          }}
        >
          <Text style={styles.loginButtonText}>add an event</Text>
        </Pressable>
      )}
      {!loading &&
        data.past.length + data.future.length === 0 &&
        !isEmpty(currentMember) &&
        currentMember.role === "president" && (
          <Text style={styles.warningText}>
            Please add an event to be able to activate your club.
          </Text>
        )}
      {!loading && data.past.length + data.future.length !== 0 && (
        <View style={styles.onlySpan}>
          <Pressable
            onPress={() => {
              setInnerTab("past");
              setIndexSelected(0);
            }}
          >
            <Text
              style={
                innerTab === "past"
                  ? styles.innerTabActive
                  : styles.innerTabInactive
              }
            >
              past
            </Text>
          </Pressable>
          <Pressable>
            <Text
              style={
                innerTab === "future"
                  ? styles.innerTabActive
                  : styles.innerTabInactive
              }
              onPress={() => {
                setInnerTab("future");
                setIndexSelected(0);
              }}
            >
              future
            </Text>
          </Pressable>
        </View>
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
        dotsLength={innerTab === "past" ? data.past.length : data.future.length}
        inactiveDotScale={1}
      />
      {innerTab === "past" && data.past.length === 0 && (
        <Text
          style={{
            fontSize: fontPixel(20),
            fontWeight: "400",
            color: "#F5F5F5",
            marginTop: pixelSizeVertical(12),
            textAlign: "center",
          }}
        >
          nothing to see here...yet
        </Text>
      )}
      {innerTab === "future" && data.future.length === 0 && (
        <Text
          style={{
            fontSize: fontPixel(20),
            fontWeight: "400",
            color: "#F5F5F5",
            marginTop: pixelSizeVertical(12),
            textAlign: "center",
          }}
        >
          nothing to see here...yet
        </Text>
      )}
      {innerTab === "past" ? (
        <Carousel
          layout="default"
          data={data.past}
          onSnapToItem={(index) => onSelect(index)}
          sliderWidth={width - 32}
          itemWidth={width - 32}
          disableIntervalMomentum
          useExperimentalSnap
          renderItem={({ item, index }) => (
            <>
              <Pressable
                onPress={() => {
                  if (item.approval === "rejected")
                    navigation.navigate("ResubmitClubsEvent", { event: item });
                }}
              >
                {item.image && (
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
                )}
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
                {item.approval === "approved" ? (
                  <>
                    <Text style={styles.date}>
                      {dayjs(item.date.split("T")[0]).format("D MMM YYYY")}
                    </Text>
                    {item.content && (
                      <Text style={styles.content}>{item.content}</Text>
                    )}
                  </>
                ) : null}
                {!isEmpty(currentMember) &&
                  currentMember.role === "president" &&
                  item.approval === "approved" && (
                    <Pressable
                      style={styles.borderButton}
                      onPress={() => {
                        handleShowDeleteModal(item.eventID);
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
      ) : null}
      {innerTab === "future" ? (
        <Carousel
          layout="default"
          data={data.future}
          onSnapToItem={(index) => onSelect(index)}
          sliderWidth={width - 32}
          itemWidth={width - 32}
          disableIntervalMomentum
          useExperimentalSnap
          renderItem={({ item, index }) => (
            <>
              <Pressable
                onPress={() => {
                  if (item.approval === "rejected")
                    navigation.navigate("ResubmitClubsEvent", { event: item });
                }}
              >
                {item.image && (
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
                )}
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
                {item.approval === "approved" ? (
                  <>
                    <Text style={styles.date}>
                      {dayjs(item.date.split("T")[0]).format("D MMM YYYY")}
                    </Text>
                    {item.content && (
                      <Text style={styles.content}>{item.content}</Text>
                    )}
                  </>
                ) : null}
                {!isEmpty(currentMember) &&
                  currentMember.role === "president" &&
                  item.approval === "approved" && (
                    <Pressable
                      style={styles.borderButton}
                      onPress={() => {
                        handleShowDeleteModal(item.eventID);
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
      ) : null}
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
            {data.past.length + data.future.length === 1
              ? "Deleting this event will set your club as inactive. Do you wish to continue?"
              : "Are you sure to delete this event?"}
          </Text>
          <Pressable
            style={loading ? styles.loginButtonDisabled : styles.loginButton}
            onPress={handleDeleteEvent}
          >
            <Text
              style={
                loading ? styles.loginButtonLoadingText : styles.loginButtonText
              }
            >
              {loading ? "deleting..." : "delete"}
            </Text>
          </Pressable>
          {!loading && (
            <Pressable onPress={() => handleShowDeleteModal()}>
              <Text style={styles.withdrawButton}>cancel</Text>
            </Pressable>
          )}
        </View>
      </Modal>
      <View style={styles.emptyView} />
      <Toast config={toastConfig} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingTop: pixelSizeVertical(4),
  },
  header: {
    fontSize: fontPixel(26),
    fontWeight: "500",
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(16),
  },
  innerTabActive: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#C4FFF9",
    marginTop: pixelSizeVertical(-8),
    marginBottom: pixelSizeVertical(20),
  },
  innerTabInactive: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#C4FFF9",
    marginTop: pixelSizeVertical(-8),
    marginBottom: pixelSizeVertical(20),
    opacity: 0.5,
  },
  image: {
    width: "100%",
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
  date: {
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#A7AFC7",
    marginBottom: pixelSizeVertical(10),
  },
  content: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: "#07BEB8",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginBottom: pixelSizeVertical(24),
    width: "100%",
    borderRadius: 5,
  },
  onlySpan: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: pixelSizeHorizontal(2),
    paddingLeft: pixelSizeHorizontal(2),
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(30),
    backgroundColor: "#0C111F",
  },
  loginButtonText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#0C111F",
    textAlign: "center",
  },
  borderButton: {
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(24),
    width: "100%",
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
  loginButtonLoadingText: {
    fontSize: fontPixel(22),
    fontWeight: "400",
    color: "#DFE5F8",
    textAlign: "center",
    marginTop: pixelSizeVertical(8),
  },
  warningText: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#C8A427",
  },
});

export default ClubsEvents;
