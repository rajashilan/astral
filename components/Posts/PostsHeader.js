import React from "react";
import FastImage from "react-native-fast-image";
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from "../../utils/responsive-font";
import { Text, View } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function PostsHeader(props) {
  dayjs.extend(relativeTime);

  //context = club or feed
  const { context, url, clubName, username, role, timestamp } = props;

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <FastImage
        style={{
          width: widthPixel(40),
          height: heightPixel(40),
          marginTop: "auto",
          marginBottom: "auto",
          borderRadius: 50,
        }}
        resizeMode="cover"
        source={{ uri: url }}
        progressiveRenderingEnabled={true}
        cache={FastImage.cacheControl.immutable}
        priority={FastImage.priority.normal}
      />

      <View
        style={{
          flexDirection: "column",
          marginLeft: pixelSizeHorizontal(5),
        }}
      >
        <Text
          style={{
            fontSize: fontPixel(14),
            fontWeight: "500",
            color: "#DFE5F8",
            marginBottom: pixelSizeVertical(2),
          }}
        >
          {context === "feed"
            ? `${clubName} - @${username}`
            : `@${username} - ${role}`}
        </Text>
        <Text
          style={{
            fontSize: fontPixel(10),
            fontWeight: "400",
            color: "#C6CDE2",
            marginLeft: pixelSizeHorizontal(2),
          }}
        >
          {/* {dayjs(new Date(timestamp).toString()).fromNow()} */}
          {dayjs(timestamp.split("T")[0]).fromNow()}
        </Text>
      </View>
    </View>
  );
}
