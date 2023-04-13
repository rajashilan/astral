import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState } from "react";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

export default function ClubsDetails() {
  const [data, setData] = useState([
    {
      meetings: [{ entry: "Tuesdays 3pm-4pm" }, { entry: "Fridays 4pm-5pm" }],
      fees: [{ entry: "RM35 yearly" }],
    },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={data}
        renderItem={({ item }) => (
          <>
            {item.meetings && <Text style={styles.title}>Meetings</Text>}
            {item.meetings &&
              item.meetings.map((meeting) => {
                return <Text style={styles.content}>{meeting.entry}</Text>;
              })}

            {item.fees && <Text style={styles.titleMarginTop}>Fees</Text>}
            {item.fees &&
              item.fees.map((fee) => {
                return <Text style={styles.content}>{fee.entry}</Text>;
              })}

            <View style={styles.emptyView} />
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingTop: pixelSizeVertical(20),
  },
  title: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  titleMarginTop: {
    marginTop: pixelSizeVertical(16),
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  content: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
  },
});
