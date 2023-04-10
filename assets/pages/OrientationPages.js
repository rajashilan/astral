import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import img1 from "../../assets/example-img-1.png";
import React, { useState } from "react";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

import hamburgerIcon from "../../assets/hamburger_icon.png";
import SideMenu from "./SideMenu";
import Modal from "react-native-modal";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../../utils/responsive-font";

const { width } = Dimensions.get("window");

export default function OrientationPages({ navigation }) {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [data, setData] = useState([
    {
      header: "first day",
      title: "Welcome to your first day at INTI!",
      content:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea ",
      subcontent: [
        {
          title: "What will you be doing?",
          content:
            "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut ",
          images: [{ image: img1 }],
        },
        {
          title: "Here are some stuff to help you out!",
          files: [
            {
              title: "student handbook",
              link: "https://google.com",
            },
            {
              title: "itinerary",
              link: "https://google.com",
            },
            {
              title: "preparation",
              link: "https://google.com",
            },
          ],
        },
      ],
    },
  ]);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={toggleSideMenu}>
          <Image
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            contentFit="contain"
          />
        </Pressable>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        keyExtractor={(data, index) => index.toString()}
        data={data}
        renderItem={({ item }) => (
          <>
            <Text style={styles.header}>{item.header}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
            {item.images &&
              item.images.map((image, index) => {
                return (
                  <Image
                    style={styles.image}
                    source={image.image}
                    contentFit="cover"
                    transition={1000}
                  />
                );
              })}
            {item.files &&
              item.files.map((file) => {
                return (
                  <>
                    <Pressable>
                      <Text style={styles.file}>{file.title}</Text>
                    </Pressable>
                  </>
                );
              })}
            {item.subcontent.map((content, index) => {
              return (
                <>
                  <Text style={styles.subtitle}>{content.title}</Text>
                  {content.content && (
                    <Text style={styles.content}>{content.content}</Text>
                  )}
                  {content.images &&
                    content.images.map((image, index) => {
                      return (
                        <Image
                          style={styles.image}
                          source={image.image}
                          contentFit="cover"
                          transition={1000}
                        />
                      );
                    })}
                  {content.files &&
                    content.files.map((file) => {
                      return (
                        <>
                          <Pressable>
                            <Text style={styles.file}>{file.title}</Text>
                          </Pressable>
                        </>
                      );
                    })}
                </>
              );
            })}
            <View style={styles.emptyView}></View>
          </>
        )}
      />
      <Modal
        isVisible={isSideMenuVisible}
        onBackdropPress={toggleSideMenu} // Android back press
        onSwipeComplete={toggleSideMenu} // Swipe to discard
        animationIn="slideInRight" // Has others, we want slide in from the left
        animationOut="slideOutRight" // When discarding the drawer
        swipeDirection="left" // Discard the drawer with swipe to left
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.sideMenuStyle} // Needs to contain the width, 75% of screen width in our case
      >
        {" "}
        <SideMenu
          callParentScreenFunction={toggleSideMenu}
          currentPage={page}
          navigation={navigation}
        />
      </Modal>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(82),
  },
  header: {
    fontSize: fontPixel(34),
    fontWeight: 500,
    color: "#F5F5F5",
    marginTop: pixelSizeVertical(30),
    marginBottom: pixelSizeVertical(28),
  },
  title: {
    fontSize: fontPixel(26),
    fontWeight: 500,
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(16),
  },
  content: {
    fontSize: fontPixel(18),
    fontWeight: 300,
    color: "#EFEFEF",
    marginBottom: pixelSizeVertical(10),
  },
  subtitle: {
    fontSize: fontPixel(22),
    fontWeight: 300,
    color: "#F5F5F5",
    marginTop: pixelSizeVertical(18),
    marginBottom: pixelSizeVertical(16),
  },
  image: {
    width: "100%",
    height: heightPixel(150),
    marginBottom: pixelSizeVertical(10),
  },
  file: {
    fontSize: fontPixel(18),
    fontWeight: 700,
    color: "#BE5007",
    marginBottom: pixelSizeVertical(10),
  },
  list: {
    paddingBottom: 0,
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
  },
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
  },
  headerContainer: {
    marginTop: pixelSizeVertical(26),
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(40),
  },
});
