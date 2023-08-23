import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import Carousel, { Pagination } from "react-native-snap-carousel";
import dayjs from "dayjs";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

import Modal from "react-native-modal";

import { useSelector, useDispatch } from "react-redux";
import {
  getClubEvent,
  handleDeleteClubEvent,
  setClubEventToFalse,
} from "../src/redux/actions/dataActions";

const { width } = Dimensions.get("window");

export default function ClubsEvents({ navigation }) {
  //can have image, must have title, must have date, can have text

  const [innerTab, setInnerTab] = useState("past");

  const dispatch = useDispatch();

  const events = useSelector((state) => state.data.clubData.event);
  const club = useSelector((state) => state.data.clubData.club);
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
    let currentDate = new Date().toISOString();
    currentDate = currentDate.split("T")[0];
    let tempPast = [];
    let tempFuture = [];

    events.map((event) => {
      if (event.date.split("T")[0] < currentDate) tempPast.push(event);
      else tempFuture.push(event);
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
    dispatch(handleDeleteClubEvent(eventID, club.clubID));
    handleShowDeleteModal();
    //check if event length is 1
    //if it is, update clubs.events as false
    if (data.past.length + data.future.length === 1)
      dispatch(setClubEventToFalse(club.clubID));
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
      <View style={styles.onlySpan}>
        <Pressable
          onPress={() => {
            setInnerTab("past");
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
            }}
          >
            future
          </Text>
        </Pressable>
      </View>
      <Pagination
        inactiveDotColor="#546593"
        dotColor={"#C4FFF9"}
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
      <Carousel
        layout="default"
        data={innerTab === "past" ? data.past : data.future}
        onSnapToItem={(index) => onSelect(index)}
        sliderWidth={width - 32}
        itemWidth={width - 32}
        disableIntervalMomentum={true}
        useExperimentalSnap={true}
        renderItem={({ item, index }) => (
          <>
            {item.image && (
              <Image
                key={index}
                style={styles.image}
                contentFit="cover"
                source={item.image}
              />
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>
              {dayjs(item.date.split("T")[0]).format("D MMM YYYY")}
            </Text>
            {item.content && <Text style={styles.content}>{item.content}</Text>}
            {!isEmpty(currentMember) && currentMember.role === "president" && (
              <Pressable
                style={styles.borderButton}
                onPress={() => {
                  handleShowDeleteModal(item.eventID);
                }}
              >
                <Text style={styles.borderButtonText}>delete</Text>
              </Pressable>
            )}
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
              { textAlign: "center", marginBottom: pixelSizeHorizontal(8) },
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
    </View>
  );
}

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
});
