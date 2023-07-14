import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import img1 from "../assets/example-img-1.png";
import img2 from "../assets/member2.png";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

import IosHeight from "../components/IosHeight";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";

import Carousel, { Pagination } from "react-native-snap-carousel";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import * as WebBrowser from "expo-web-browser";

import { useDispatch, useSelector } from "react-redux";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { getOrientationPage } from "../src/redux/actions/dataActions";
import { render } from "react-dom";

const { width } = Dimensions.get("window");

export default function OrientationPages({ navigation, route }) {
  const { orientationPageID } = route.params;

  const page = useSelector((state) => state.data.orientation.currentPage);
  const loading = useSelector((state) => state.data.loading);
  const dispatch = useDispatch();

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [indexSelected, setIndexSelected] = useState(0);

  const [data, setData] = useState([]);

  const [focusImage, setFocusImage] = useState("");
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [goBack, setGoBack] = useState(false);

  //on mount
  //set render to true
  //dispatches get orientation page -> loading data
  //if

  useEffect(() => {
    setRendered(true);
    setGoBack(false);
    dispatch(getOrientationPage(orientationPageID));
  }, []);

  useEffect(() => {
    if (rendered && !loading) setData([page]);
  }, [page, rendered]);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    setData([]);
    setRendered(false);
    setGoBack(true);
  };

  useEffect(() => {
    if (!rendered && goBack) navigation.navigate("Orientation");
  }, [rendered, goBack]);

  const onLayout = (event) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const handleFocusImage = (image) => {
    if (image) {
      setFocusImage(image);
      setIsImageModalVisible(!isImageModalVisible);
    } else {
      setFocusImage("");
      setIsImageModalVisible(!isImageModalVisible);
    }
  };

  useEffect(() => {
    //if scroll height is more than header height and the header is not shown, show
    if (scrollHeight > headerHeight && !showMiniHeader) setShowMiniHeader(true);
    else if (scrollHeight < headerHeight && showMiniHeader)
      setShowMiniHeader(false);
  }, [scrollHeight, showMiniHeader]);

  return (
    <View style={styles.container}>
      <IosHeight />
      <View style={styles.headerContainerShowMiniHeader}>
        <Pressable
          onPress={() => {
            handleNavigateBack();
          }}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Text style={styles.backButton}>back</Text>
        </Pressable>
        {showMiniHeader ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            {data[0] && data[0].header && (
              <Text style={styles.headerMini} numberOfLines={1}>
                {data[0].header}
              </Text>
            )}
          </Animated.View>
        ) : (
          <Text style={styles.headerMiniInvisible}>title</Text>
        )}
        <Pressable
          onPress={toggleSideMenu}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Image
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            contentFit="contain"
          />
        </Pressable>
      </View>

      <FlatList
        scrollEventThrottle={16}
        onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        keyExtractor={(data, index) => index.toString()}
        data={data}
        renderItem={({ item }) => (
          <>
            <View onLayout={onLayout}>
              <Text style={styles.header}>{item.title}</Text>
            </View>
            {item.header && <Text style={styles.title}>{item.header}</Text>}
            {item.content && <Text style={styles.content}>{item.content}</Text>}
            {item.subcontent &&
              item.subcontent.map((content, index) => {
                return (
                  <View style={styles.contentContainer}>
                    <Text style={styles.subtitle}>{content.title}</Text>
                    {content.content && (
                      <Text style={styles.contentNoPadding}>
                        {content.content}
                      </Text>
                    )}
                    {content.image && (
                      <>
                        <Carousel
                          layout="default"
                          data={content.image}
                          disableIntervalMomentum={true}
                          useExperimentalSnap={true}
                          onSnapToItem={(index) => onSelect(index)}
                          sliderWidth={width - 32}
                          itemWidth={width - 32}
                          renderItem={({ item, index }) => (
                            <>
                              <Image
                                key={index}
                                style={styles.image}
                                resizeMode="cover"
                                source={item}
                              />
                            </>
                          )}
                        />
                        <Pagination
                          inactiveDotColor="#546593"
                          dotColor={"#C4FFF9"}
                          activeDotIndex={indexSelected}
                          containerStyle={{
                            paddingTop: 0,
                            paddingRight: pixelSizeHorizontal(16),
                            paddingLeft: pixelSizeHorizontal(16),
                            paddingBottom: 0,
                            marginBottom: pixelSizeVertical(12),
                          }}
                          dotsLength={content.image.length}
                          inactiveDotScale={1}
                        />
                      </>
                    )}
                    {content.files &&
                      content.files.map((file) => {
                        return (
                          <>
                            <Pressable
                              onPress={async () =>
                                await WebBrowser.openBrowserAsync(file.url)
                              }
                            >
                              <Text style={styles.file}>{file.filename}</Text>
                            </Pressable>
                          </>
                        );
                      })}
                  </View>
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
        <SideMenu
          callParentScreenFunction={toggleSideMenu}
          currentPage={"orientation"}
          navigation={navigation}
        />
      </Modal>
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
  },
  header: {
    fontSize: fontPixel(34),
    fontWeight: "700",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(26),
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  title: {
    fontSize: fontPixel(28),
    fontWeight: "500",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(8),
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  content: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
    marginBottom: pixelSizeVertical(10),
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  contentNoPadding: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
    marginBottom: pixelSizeVertical(10),
  },
  subtitle: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(6),
  },
  image: {
    width: "100%",
    height: heightPixel(350),
    marginTop: pixelSizeVertical(10),
    marginBottom: pixelSizeVertical(10),
    borderRadius: 5,
  },
  file: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#BE5007",
    marginBottom: pixelSizeVertical(10),
    textDecorationLine: "underline",
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
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(30),
  },
  backButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#C4FFF9",
    marginTop: pixelSizeVertical(4),
  },
  headerMini: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    maxWidth: width - 180,
    marginLeft: pixelSizeHorizontal(-10),
  },
  headerMiniInvisible: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginRight: pixelSizeHorizontal(16),
    maxWidth: "80%",
    opacity: 0,
  },
  headerContainerShowMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  headerContainerHideMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  contentContainer: {
    paddingTop: pixelSizeVertical(20),
    paddingBottom: pixelSizeVertical(20),
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    backgroundColor: "#131A2E",
    marginBottom: pixelSizeVertical(10),
  },
  focusImage: {
    width: width * 0.85,
    height: heightPixel(350),
    borderRadius: 5,
  },
  focusImageModal: {
    margin: 0,
    width: width, // SideMenu width
    alignSelf: "center",
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
});
