import React, { useEffect, useState } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from "../../utils/responsive-font";
import Animated, {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { submitAVote } from "../../src/redux/actions/dataActions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function Poll(props) {
  const { data } = props;
  const { options, expiresAt, votes, postID } = data;

  dayjs.extend(relativeTime);

  const [totalVotes, setTotalVotes] = useState(0);
  const [activeStatus, setActiveStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.credentials);
  const campusID = useSelector((state) => state.data.campus.campusID);

  const currentUserID = user.userId;

  useEffect(() => {
    try {
      //need to get the total number of votes to calculate the percentage
      let totalVotes = 0;
      options.forEach((option) => {
        totalVotes += option.votes;
      });
      setTotalVotes(totalVotes);

      //need to set active status of poll
      const currentTime = new Date();
      if (new Date(expiresAt) < currentTime) {
        setActiveStatus(false);
      } else {
        setActiveStatus(true);
      }

      //need to set if user has made a selection
      if (votes[currentUserID] !== undefined) {
        setSelectedOption(votes[currentUserID].optionID);
      }
    } catch (error) {
      console.error(error);
    }
  }, [options, expiresAt]);

  const handlePollPress = (optionID) => {
    // If the user hasn't voted yet (1st situation)
    if (votes[currentUserID] === undefined) {
      handleFirstTimeVote(optionID);
    }
    // If the user is changing their vote (2nd situation)
    else if (votes[currentUserID].optionID !== optionID) {
      handleVoteChange(optionID);
    }
    // If the user is voting for the same option (3rd situation), do nothing
  };

  const handleFirstTimeVote = (optionID) => {
    const voteData = createVoteData(optionID);

    // Store the vote data for the current user
    votes[currentUserID] = voteData;

    // Increment total votes
    updateTotalVotes(1);

    // Increment the vote count for the chosen option
    options[optionID].votes += 1;

    // Update selected option in UI
    setSelectedOption(optionID);

    // Dispatch the vote
    dispatch(submitAVote(voteData, currentUserID, postID));
  };

  const handleVoteChange = (newOptionID) => {
    const prevOptionID = votes[currentUserID].optionID;
    const voteData = createVoteData(newOptionID);

    // Update the vote for the current user
    votes[currentUserID] = voteData;

    // Adjust the vote count for the new and previous options
    options[newOptionID].votes += 1;
    options[prevOptionID].votes -= 1;

    // Update selected option in UI
    setSelectedOption(newOptionID);

    // Dispatch the vote change
    dispatch(submitAVote(voteData, currentUserID, postID));
  };

  const createVoteData = (optionID) => {
    return {
      optionID,
      createdAt: new Date().toISOString(),
    };
  };

  const updateTotalVotes = (incrementBy) => {
    let temp = totalVotes + incrementBy;
    setTotalVotes(temp);
  };

  const activePoll = options.map((option, index) => {
    return (
      <Pressable
        onPress={() => {
          if (activeStatus) handlePollPress(option.optionID);
        }}
        key={index}
        style={style.activePoll}
      >
        <Text style={style.activeText}>{option.text}</Text>
      </Pressable>
    );
  });

  const inActivePoll = options.map((option, index) => {
    let percentage = Math.round((option.votes / totalVotes) * 100);

    //handle the possiblity if there are no votes for the option
    if (!percentage) percentage = 0;
    const width = useSharedValue(0);
    width.value = withTiming(percentage, { duration: 1000 });

    const animatedWidth = useDerivedValue(() => {
      return `${width.value}%`; // Convert to percentage
    });

    return (
      <Pressable
        onPress={() => {
          if (activeStatus) handlePollPress(option.optionID);
        }}
        key={index}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          width: "100%",
          paddingHorizontal: pixelSizeHorizontal(16),
          marginBottom: pixelSizeVertical(8),
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            width: animatedWidth,
            height: "100%",
            backgroundColor:
              selectedOption !== null && selectedOption === index
                ? "#13B2AD"
                : "#6072A5", // Set your desired color here
            zIndex: -1, // Send the background behind the item
            borderRadius: 5,
          }}
        />
        <Text style={style.inActiveText}>{option.text}</Text>
        <Text style={style.percentageText}>{percentage}%</Text>
      </Pressable>
    );
  });

  return (
    <View
      style={{
        marginTop: pixelSizeVertical(14),
      }}
    >
      {/* inactive poll when selectedOption or expired */}
      {!activeStatus || selectedOption !== null ? inActivePoll : activePoll}
      {activeStatus ? (
        <Text
          style={{
            fontSize: fontPixel(12),
            fontWeight: "400",
            color: "#C6CDE2",
            marginTop: pixelSizeVertical(10),
            marginLeft: pixelSizeHorizontal(2),
          }}
        >
          {/* {dayjs(new Date(timestamp).toString()).fromNow()} */}
          poll ends {dayjs(expiresAt).fromNow()}
        </Text>
      ) : null}
    </View>
  );
}

const style = StyleSheet.create({
  activePoll: {
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#07BEB8",
    paddingVertical: pixelSizeVertical(12),
    paddingHorizontal: pixelSizeHorizontal(16),
    marginBottom: pixelSizeVertical(8),
  },
  activeText: {
    fontSize: fontPixel(14),
    fontWeight: "500",
    color: "#07BEB8",
  },
  inActiveText: {
    fontSize: fontPixel(14),
    fontWeight: "500",
    color: "#DFE5F8",
    maxWidth: "70%",
    paddingVertical: pixelSizeVertical(12),
  },
  percentageText: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#DFE5F8",
    marginLeft: pixelSizeHorizontal(35),
    paddingVertical: pixelSizeVertical(12),
  },
});
