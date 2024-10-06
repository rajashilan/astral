import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Pressable, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import {
  createNotification,
  handleDeactivateClub,
  handleUpdateClubDetails,
} from "../src/redux/actions/dataActions";
import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";
import EmptyView from "../components/EmptyView";
import CustomTextInput from "../components/CustomTextInput";
import WarningContainer from "../components/WarningContainer";
import LinksView from "../components/LinksView";

const ClubsDetails = React.memo(({ onScroll }) => {
  const dispatch = useDispatch();

  const club = useSelector((state) => state.data.clubData.club);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const campusID = useSelector((state) => state.data.campus.campusID);
  const data = useSelector((state) => state.data.clubData.club.details);
  const loading = useSelector((state) => state.data.loading);

  const isFocused = useIsFocused();

  const [meetings, setMeetings] = useState("");
  const [fees, setFees] = useState("");
  const [more, setMore] = useState("");

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    if (isFocused) {
      handleScroll(0);
    }
  }, [isFocused]);

  useEffect(() => {
    setDetails();
  }, [data]);

  const setDetails = () => {
    if (data) {
      setMeetings(data.schedule);
      setFees(data.fees);
      setMore(data.misc);
    }
  };

  const handleUpdateDetails = () => {
    const updateData = {
      schedule: meetings,
      fees,
      misc: more,
    };
    dispatch(handleUpdateClubDetails(club.clubID, updateData));

    if (
      (club.status === "active" && updateData.schedule === "") ||
      (club.status === "active" && updateData.fees === "")
    ) {
      dispatch(handleDeactivateClub(club.clubID, campusID, false));
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
  };

  //show normal view if user is other than president
  //show edit view if user is presient

  const normalView = (
    <>
      {meetings && <Text style={styles.title}>Meetings</Text>}
      {meetings && <Text style={styles.content}>{meetings}</Text>}
      {fees && <Text style={styles.titleMarginTop}>Fees</Text>}
      {fees && <Text style={styles.content}>{fees}</Text>}
      {more && <Text style={styles.titleMarginTop}>More...</Text>}
      {more && <Text style={styles.content}>{more}</Text>}
      <LinksView content={`${meetings} ${fees} ${more}`} />
    </>
  );

  const editView = (
    <>
      {(!loading && meetings === "") || (!loading && fees === "") ? (
        <WarningContainer>
          <Text style={styles.warningText}>
            add meetings and fees details to be able to activate your club.
          </Text>
        </WarningContainer>
      ) : null}
      <Text style={[styles.title, { paddingLeft: pixelSizeHorizontal(8) }]}>
        Meetings
      </Text>
      <CustomTextInput
        placeholder="Enter your club's meeting schedule. It would be good to add the day, time, venue, and frequency. Eg: Every Thurday, 5pm, at LR504."
        value={meetings}
        multiline={true}
        numberOfLines={4}
        editable={!loading}
        onChangeText={(meetings) => setMeetings(meetings)}
      />
      <Text
        style={[styles.titleMarginTop, { paddingLeft: pixelSizeHorizontal(8) }]}
      >
        Fees
      </Text>
      <CustomTextInput
        placeholder="Enter your club's fees. Please add the amount, and frequency. Eg: RM20 per month."
        value={fees}
        multiline={true}
        numberOfLines={4}
        editable={!loading}
        onChangeText={(fees) => setFees(fees)}
      />
      <Text
        style={[styles.titleMarginTop, { paddingLeft: pixelSizeHorizontal(8) }]}
      >
        More...
      </Text>
      <CustomTextInput
        placeholder="Enter more details about the Club should you wish to share. This is optional."
        value={more}
        multiline={true}
        numberOfLines={4}
        editable={!loading}
        onChangeText={(more) => setMore(more)}
      />
      {((data && meetings !== data.schedule) ||
        (data && fees !== data.fees) ||
        (data && more !== data.misc)) && (
        <>
          <PrimaryButton
            loading={loading}
            onPress={handleUpdateDetails}
            text="save"
          />
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

  const handleScroll = (scrollHeight) => {
    onScroll(scrollHeight);
  };

  return (
    <ScrollView
      style={styles.container}
      scrollEventThrottle={16}
      onScroll={(event) => handleScroll(event.nativeEvent.contentOffset.y)}
    >
      {!isEmpty(currentMember) && currentMember.role === "president"
        ? editView
        : normalView}
      <Toast config={toastConfig} />
      <EmptyView />
      <EmptyView />
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
  tertiaryButton: {
    color: "#A7AFC7",
    fontSize: fontPixel(22),
    textTransform: "lowercase",
    fontWeight: "400",
    textAlign: "center",
  },
  warningText: {
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
  },
});

export default ClubsDetails;
