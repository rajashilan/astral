import React from "react";
import { Text, View } from "react-native";
import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from "../../utils/responsive-font";
import PostsHeader from "./PostsHeader";
import Photos from "./Photos";
import File from "./File";
import Poll from "./Poll";
import Event from "./Event";

export default function PostsAdapter(props) {
  const { context, item } = props;

  //header remains the same for all posts, so need a separate component for that
  //text also the same, if available, show
  //diff components: photos, files, polls, ?events?

  return (
    <View
      style={{
        paddingHorizontal: pixelSizeHorizontal(16),
        flexDirection: "column",
        borderStyle: "solid",
        borderWidth: 1,
        borderTopColor: "#232F52",
        borderBottomColor: "#232F52",
        paddingVertical: pixelSizeVertical(24),
      }}
    >
      <PostsHeader
        context={context}
        url={item.clubImageUrl}
        clubName={item.clubName}
        username={item.createdByUsername}
        role={item.createdByRole}
        timestamp={item.createdAt}
        createdBy={item.createdBy}
        postID={item.postID}
      />
      {item.text ? (
        <Text
          style={{
            marginTop: pixelSizeVertical(8),
            fontSize: fontPixel(14),
            fontWeight: "400",
            color: "#C6CDE2",
          }}
        >
          {item.text}
        </Text>
      ) : null}

      {item.type === "photo" ? <Photos data={item.photos} /> : null}
      {item.type === "event" ? (
        <Event
          data={item.photos}
          title={item.title}
          content={item.content}
          date={item.date}
        />
      ) : null}
      {item.type === "file" ? <File file={item.file} /> : null}
      {item.type === "poll" ? (
        <Poll
          data={{
            createdAt: item.createdAt,
            expiresAt: item.expiresAt,
            options: item.options,
            votes: item.votes,
            postID: item.postID,
          }}
        />
      ) : null}
    </View>
  );
}
