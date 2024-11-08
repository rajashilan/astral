import React, { useRef, useState } from "react";
import { Text, View, Pressable } from "react-native";
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
import Likes from "./Likes";
import Comments from "./Comments";

export default function PostsAdapter(props) {
  const { context, item } = props;

  //header remains the same for all posts, so need a separate component for that
  //text also the same, if available, show
  //diff components: photos, files, polls, ?events?

  const [isExpanded, setIsExpanded] = useState(false); // State to toggle full text
  const [isClipped, setIsClipped] = useState(false); // State to check if text is clipped
  const textRef = useRef(null); // Ref to access the text element

  const handleTextLayout = (e) => {
    const { height } = e.nativeEvent.layout; // Get the height of the Text component
    if (height > 45) {
      // Threshold to decide if the text is clipped (adjust as needed)
      setIsClipped(true);
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const UI =
    item.status === "active" || context === "SuspendedPost" ? (
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
          clubImageUrl={item.clubImageUrl}
          clubName={item.clubName}
          username={item.createdByUsername}
          userImageUrl={item.createdByImageUrl}
          role={item.createdByRole}
          timestamp={item.createdAt}
          createdBy={item.createdBy}
          postID={item.postID}
          clubID={item.clubID}
        />
        {item.text ? (
          <Text
            ref={textRef}
            onLayout={handleTextLayout} // Track the layout of the Text component
            numberOfLines={isExpanded ? 0 : 3} // Show 3 lines or full text based on `isExpanded`
            ellipsizeMode="tail" // Show ellipsis ("...") when text overflows
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
        {isClipped && !isExpanded && (
          <Pressable onPress={toggleExpand}>
            <Text style={{ color: "#8C91FB", marginTop: 5 }}>Show more</Text>
          </Pressable>
        )}

        {isExpanded && (
          <Pressable onPress={toggleExpand}>
            <Text style={{ color: "#8C91FB", marginTop: 5 }}>Show less</Text>
          </Pressable>
        )}

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
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Likes postID={item.postID} likesCount={item.likesCount} />
          <Comments />
        </View>
      </View>
    ) : null;

  return UI;
}
