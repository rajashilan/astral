import dayjs from "dayjs";
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
import Carousel from "react-native-snap-carousel";
import Toast from "react-native-toast-message";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

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
import PrimaryButton from "../components/PrimaryButton";
import EmptyView from "../components/EmptyView";
import WarningContainer from "../components/WarningContainer";

const { width } = Dimensions.get("window");

const ClubsEvents = React.memo(({ navigation, onScroll }) => {
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

  const isFocused = useIsFocused();

  const [indexSelected, setIndexSelected] = useState(0);

  console.log(currentMember);

  const [data, setData] = useState({
    past: [],
    future: [],
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventID, setEventID] = useState("");

  useEffect(() => {
    if (isFocused) {
      handleScroll(0);
    }
  }, [isFocused]);

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
          onPress={() => navigation.navigate("AddClubsEvent")}
          text="add an event"
          buttonStyle={{ marginTop: 0 }}
        />
      )}
      {!loading &&
        data.past.length + data.future.length === 0 &&
        !isEmpty(currentMember) &&
        currentMember.role === "president" && (
          <WarningContainer
            style={{
              marginBottom: pixelSizeVertical(16),
              marginTop: pixelSizeVertical(-8),
            }}
          >
            <Text style={styles.warningText}>
              add an event to be able to activate your club.
            </Text>
          </WarningContainer>
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
      {data.past.length > 0 || data.future.length > 0 ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: pixelSizeVertical(12),
          }}
        >
          <View
            style={
              innerTab === "past"
                ? indexSelected > 0 && data.past.length > 1
                  ? styles.activeDot
                  : styles.inactiveDot
                : indexSelected > 0 && data.future.length > 1
                  ? styles.activeDot
                  : styles.inactiveDot
            }
          ></View>
          <View
            style={
              innerTab === "past"
                ? indexSelected < data.past.length - 1
                  ? styles.activeDot
                  : styles.inactiveDot
                : indexSelected < data.future.length - 1
                  ? styles.activeDot
                  : styles.inactiveDot
            }
          ></View>
        </View>
      ) : null}
      {innerTab === "past" &&
      data.past.length === 0 &&
      !currentMember.role === "president" ? (
        <Text
          style={{
            fontSize: fontPixel(20),
            fontWeight: "400",
            color: "#F5F5F5",
            marginTop: pixelSizeVertical(12),
            textAlign: "center",
          }}
        >
          oops, nothing to see here...yet 👀
        </Text>
      ) : null}
      {innerTab === "future" &&
      data.future.length === 0 &&
      !currentMember.role === "president" ? (
        <Text
          style={{
            fontSize: fontPixel(20),
            fontWeight: "400",
            color: "#F5F5F5",
            marginTop: pixelSizeVertical(12),
            textAlign: "center",
          }}
        >
          oops, nothing to see here...yet 👀
        </Text>
      ) : null}
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
                        ? [styles.title, { color: "#ed3444" }]
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
                        color: "#ed3444",
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
                  <>
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
                  </>
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
                        ? [styles.title, { color: "#ed3444" }]
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
                        color: "#ed3444",
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
          <PrimaryButton
            loading={loading}
            onPress={handleDeleteEvent}
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
    width: width - pixelSizeHorizontal(33),
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
  onlySpan: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: pixelSizeHorizontal(2),
    paddingLeft: pixelSizeHorizontal(2),
    marginTop: pixelSizeVertical(4),
  },
  borderButton: {
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(24),
    width: width - pixelSizeHorizontal(33),
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
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
  },
  inactiveDot: {
    height: 10,
    width: 10,
    backgroundColor: "#546593",
    borderRadius: 50,
  },
  activeDot: {
    height: 10,
    width: 10,
    backgroundColor: "#C4FFF9",
    borderRadius: 50,
  },
});

export default ClubsEvents;
