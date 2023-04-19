import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React, { useState } from "react";
import member1 from "../assets/member1.png";
import member2 from "../assets/member2.png";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { Image } from "expo-image";
import Carousel, { Pagination } from "react-native-snap-carousel";

const { width } = Dimensions.get("window");

export default function ClubsMembers(props) {
  const [data, setData] = useState([
    {
      members: 13,
      membersData: [
        {
          name: "Jonathan",
          year: 3,
          course: "BCSCU",
          role: "President",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. ",
          image: member1,
        },
        {
          name: "Kelly",
          year: 2,
          course: "BCSCU",
          role: "Vice President",
          quote: "I am your mother",
          image: member2,
        },
      ],
    },
  ]);

  const [indexSelected, setIndexSelected] = useState(0);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{data[0].members} members</Text>
      <Pagination
        inactiveDotColor="#546593"
        dotColor={"#07BEB8"}
        activeDotIndex={indexSelected}
        containerStyle={{
          paddingTop: 0,
          paddingRight: pixelSizeHorizontal(16),
          paddingLeft: pixelSizeHorizontal(16),
          paddingBottom: 0,
          marginBottom: pixelSizeVertical(12),
        }}
        dotsLength={data[0].membersData.length}
        inactiveDotScale={1}
      />
      <Carousel
        layout="default"
        data={data[0].membersData}
        onSnapToItem={(index) => onSelect(index)}
        sliderWidth={width - 32}
        itemWidth={width - 32}
        renderItem={({ item, index }) => (
          <>
            <Image
              key={index}
              style={styles.image}
              resizeMode="cover"
              source={item.image}
            />
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.name}>
              {item.name} - Year {item.year}, {item.course}
            </Text>
            <Text style={styles.quote}>"{item.quote}"</Text>
          </>
        )}
      />
      <Pressable style={styles.button}>
        <View style={styles.onlySpan}>
          <Text style={styles.loginButtonNoUnderline}>j</Text>
          <Text style={styles.loginButton}>oin</Text>
        </View>
      </Pressable>
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
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(20),
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 280,
    marginBottom: pixelSizeVertical(12),
    borderRadius: 5,
  },
  role: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(4),
  },
  name: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  quote: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
  },
  onlySpan: {
    flexDirection: "row",
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(30),
    backgroundColor: "#0C111F",
  },
});
