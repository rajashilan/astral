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

export default function Poll(props) {
  const { data } = props;
  const { options, expiresAt, votes } = data;

  //TODO: replace with actual user id
  const currentUserID = "1234";

  const [totalVotes, setTotalVotes] = useState(0);
  const [activeStatus, setActiveStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

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
        console.log(votes[currentUserID].optionID);
        setSelectedOption(votes[currentUserID].optionID);
      }
    } catch (error) {
      console.error(error);
    }
  }, [options, expiresAt]);

  const handlePollPress = () => {
    //3 situations
    //1st: user is choosing an option for the first time
    //2nd: user has chosen an option before and is choosing a new option
    //3rd: user choosing the same option (do nothing)
  };

  const activePoll = options.map((option, index) => {
    return (
      <Pressable
        onPress={() => {
          if (activeStatus) handlePollPress();
        }}
        key={index}
        style={style.activePoll}
      >
        <Text style={style.activeText}>{option.text}</Text>
      </Pressable>
    );
  });

  /*
  inactive poll:
  - need to calculate percentage
  - view is independent from background
  - background color percentage: votes percentage
  */

  const inActivePoll = options.map((option, index) => {
    const percentage = Math.round((option.votes / totalVotes) * 100);
    const width = useSharedValue(0);
    width.value = withTiming(percentage, { duration: 1000 });

    const animatedWidth = useDerivedValue(() => {
      return `${width.value}%`; // Convert to percentage
    });

    return (
      <Pressable
        onPress={() => {
          if (activeStatus) handlePollPress();
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
