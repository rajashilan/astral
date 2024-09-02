import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Video } from "expo-av";

//images
import hamburgerIcon from "../assets/hamburger_icon.png";

//components
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import EmptyView from "../components/EmptyView";
import Loader from "../components/Loader";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getOrientationPage } from "../src/redux/actions/dataActions";
import { RESET_ORIENTATION_PAGE } from "../src/redux/type";

const { width } = Dimensions.get("window");

export default React.memo(function OrientationPages({ navigation, route }) {
  const { orientationPageID } = route.params;

  const page = useSelector((state) => state.data.orientation.currentPage);
  const loading = useSelector((state) => state.data.loading);
  const dispatch = useDispatch();

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(150);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [indexSelected, setIndexSelected] = useState(0);

  const [data, setData] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getOrientationPage(orientationPageID));
    }, 200);
    return () => {
      dispatch({ type: RESET_ORIENTATION_PAGE });
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    setData([page]);
  }, [page]);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.navigate("Orientation");
  };

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  useEffect(() => {
    //if scroll height is more than header height and the header is not shown, show
    if (scrollHeight > headerHeight && !showMiniHeader) setShowMiniHeader(true);
    else if (scrollHeight < headerHeight && showMiniHeader)
      setShowMiniHeader(false);
  }, [scrollHeight, showMiniHeader]);

  const UI = loading ? (
    <Loader />
  ) : (
    <FlatList
      removeClippedSubviews={true}
      scrollEventThrottle={16}
      onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.list}
      keyExtractor={(data, index) => index.toString()}
      data={data}
      renderItem={({ item }) => (
        <React.Fragment>
          <View onLayout={onLayout}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          {item.header && <Text style={styles.header}>{item.header}</Text>}
          {item.content && <Text style={styles.content}>{item.content}</Text>}
          {item.videos &&
            item.videos.map((video) => {
              let videoID = video.url.split("/");
              videoID = videoID[videoID.length - 2];
              return (
                <Video
                  key={video.videoID}
                  source={{
                    uri: `https://drive.google.com/uc?id=${videoID}`,
                  }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                />
              );
            })}
          {item.subcontent &&
            item.subcontent.map((content, index) => {
              console.log("subcontent", content);
              return (
                <View
                  key={(index * 321).toString()}
                  style={styles.contentContainer}
                >
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
                        disableIntervalMomentum
                        useExperimentalSnap
                        onSnapToItem={(index) => onSelect(index)}
                        sliderWidth={width - 32}
                        itemWidth={width - 32}
                        renderItem={({ item, index }) => (
                          <React.Fragment>
                            <FastImage
                              style={styles.image}
                              resizeMode="cover"
                              source={{ uri: item }}
                              progressiveRenderingEnabled={true}
                              cache={FastImage.cacheControl.immutable}
                              priority={FastImage.priority.normal}
                            />
                          </React.Fragment>
                        )}
                      />
                      <Pagination
                        inactiveDotColor="#546593"
                        dotColor="#C4FFF9"
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
                        <React.Fragment key={file.url}>
                          <Pressable
                            onPress={async () =>
                              await WebBrowser.openBrowserAsync(file.url)
                            }
                          >
                            <Text style={styles.file}>{file.filename}</Text>
                          </Pressable>
                        </React.Fragment>
                      );
                    })}
                </View>
              );
            })}
          <EmptyView />
        </React.Fragment>
      )}
    />
  );

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
            {data[0] && data[0].title && (
              <Text style={styles.headerMini} numberOfLines={1}>
                {data[0].title}
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
          <FastImage
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {UI}

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
          currentPage="orientation"
          navigation={navigation}
        />
      </Modal>
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
  },
  title: {
    fontSize: fontPixel(26),
    fontWeight: "700",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(8),
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  header: {
    fontSize: fontPixel(18),
    fontWeight: "500",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(16),
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
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
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
  contentContainer: {
    paddingTop: pixelSizeVertical(20),
    paddingBottom: pixelSizeVertical(20),
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    backgroundColor: "#131A2E",
    marginBottom: pixelSizeVertical(10),
  },
  video: {
    alignSelf: "center",
    width: width - 32,
    height: 180,
    backgroundColor: "#1A2238",
    marginBottom: pixelSizeVertical(16),
  },
});
