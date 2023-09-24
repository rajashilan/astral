import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import React, { useEffect, useState } from "react";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import { useSelector, useDispatch } from "react-redux";
import {
  handleDeactivateClub,
  handleUpdateClubDetails,
} from "../src/redux/actions/dataActions";

export default function ClubsDetails({ navigation }) {
  const dispatch = useDispatch();

  const club = useSelector((state) => state.data.clubData.club);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const campusID = useSelector((state) => state.data.campus.campusID);
  const data = useSelector((state) => state.data.clubData.club.details);
  const loading = useSelector((state) => state.data.loading);

  const [meetings, setMeetings] = useState("");
  const [fees, setFees] = useState("");
  const [more, setMore] = useState("");

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    setDetails();
  }, [data]);

  const setDetails = () => {
    setMeetings(data.schedule);
    setFees(data.fees);
    setMore(data.misc);
  };

  const handleUpdateDetails = () => {
    let data = {
      schedule: meetings,
      fees,
      misc: more,
    };
    dispatch(handleUpdateClubDetails(club.clubID, data));
    dispatch(handleDeactivateClub(club.clubID, campusID, false));
  };

  //show normal view if user is other than president
  //show edit view if user is presient

  let normalView = (
    <>
      {meetings && <Text style={styles.title}>Meetings</Text>}
      {meetings && <Text style={styles.content}>{meetings}</Text>}
      {fees && <Text style={styles.titleMarginTop}>Fees</Text>}
      {fees && <Text style={styles.content}>{fees}</Text>}
      {more && <Text style={styles.titleMarginTop}>More...</Text>}
      {more && <Text style={styles.content}>{more}</Text>}
    </>
  );

  let editView = (
    <>
      {(!loading && meetings === "") || (!loading && fees === "") ? (
        <Text style={styles.warningText}>
          Please add meetings and fees details to be able to activate your club.
        </Text>
      ) : null}
      <Text style={[styles.title, { paddingLeft: pixelSizeHorizontal(8) }]}>
        Meetings
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your club's meeting schedule. It would be good to add the day, time, venue, and frequency. Eg: Every Thurday, 5pm, at LR504."
        placeholderTextColor="#C6CDE2"
        value={meetings}
        multiline
        numberOfLines={4}
        editable={!loading}
        onChangeText={(meetings) => setMeetings(meetings)}
      />
      <Text
        style={[styles.titleMarginTop, { paddingLeft: pixelSizeHorizontal(8) }]}
      >
        Fees
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your club's fees. Please add the amount, and frequency. Eg: RM20 per month."
        placeholderTextColor="#C6CDE2"
        value={fees}
        multiline
        numberOfLines={4}
        editable={!loading}
        onChangeText={(fees) => setFees(fees)}
      />
      <Text
        style={[styles.titleMarginTop, { paddingLeft: pixelSizeHorizontal(8) }]}
      >
        More...
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter more details about the Club should you wish to share. This is optional."
        placeholderTextColor="#C6CDE2"
        value={more}
        multiline
        numberOfLines={4}
        editable={!loading}
        onChangeText={(more) => setMore(more)}
      />

      {(meetings !== data.schedule ||
        fees !== data.fees ||
        more !== data.misc) && (
        <>
          <Pressable
            style={loading ? styles.loginButtonDisabled : styles.loginButton}
            onPress={handleUpdateDetails}
          >
            <Text
              style={
                loading ? styles.loginButtonLoadingText : styles.loginButtonText
              }
            >
              {loading ? "saving details..." : "save"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setDetails();
            }}
          >
            <Text style={styles.tertiaryButton}>discard</Text>
          </Pressable>
        </>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {!isEmpty(currentMember) && currentMember.role === "president"
        ? editView
        : normalView}
      <Toast config={toastConfig} />
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
  title: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(4),
  },
  titleMarginTop: {
    marginTop: pixelSizeVertical(16),
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
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
  },
  textInput: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    width: "100%",
    borderRadius: 5,
  },
  loginButtonLoadingText: {
    fontSize: fontPixel(22),
    fontWeight: "400",
    color: "#DFE5F8",
    textAlign: "center",
  },
  loginButtonDisabled: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(24),
    width: "100%",
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: "#07BEB8",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(30),
    width: "100%",
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#0C111F",
    textAlign: "center",
  },
  tertiaryButton: {
    color: "#A7AFC7",
    fontSize: fontPixel(22),
    textTransform: "lowercase",
    fontWeight: "400",
    textAlign: "center",
  },
  warningText: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#C8A427",
    marginBottom: pixelSizeVertical(32),
  },
});
