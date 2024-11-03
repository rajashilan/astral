import FastImage from "react-native-fast-image";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import EmptyView from "../components/EmptyView";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import IosHeight from "../components/IosHeight";
import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

const ClubsMembers = React.memo(({ navigation }) => {
  const members = useSelector((state) => state.data.clubData.members);
  const numberOfMembers =
    members.length === 1
      ? `${members.length} member`
      : `${members.length} members`;

  const [indexSelected, setIndexSelected] = useState(0);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  useEffect(() => {
    //if scroll height is more than header height and the header is not shown, show
    if (scrollHeight > headerHeight && !showMiniHeader) setShowMiniHeader(true);
    else if (scrollHeight < headerHeight && showMiniHeader)
      setShowMiniHeader(false);
  }, [scrollHeight, showMiniHeader]);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <IosHeight />
      <View style={styles.headerContainerShowMiniHeader}>
        <Pressable
          onPress={handleNavigateBack}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Text style={styles.backButton}>back</Text>
        </Pressable>
        {showMiniHeader ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              club members
            </Text>
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
      <ScrollView
        scrollEventThrottle={16}
        onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
        style={{
          paddingHorizontal: pixelSizeHorizontal(16),
        }}
      >
        <View onLayout={onLayout}>
          <Header header="club members" />
        </View>
        {numberOfMembers && (
          <Text style={styles.disclaimer}>{numberOfMembers}</Text>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: pixelSizeVertical(12),
          }}
        >
          <View
            style={
              indexSelected > 0 && members.length > 1
                ? styles.activeDot
                : styles.inactiveDot
            }
          ></View>
          <View
            style={
              indexSelected < members.length - 1
                ? styles.activeDot
                : styles.inactiveDot
            }
          ></View>
        </View>
        <Carousel
          layout="default"
          data={members && members}
          disableIntervalMomentum
          useExperimentalSnap
          onSnapToItem={(index) => onSelect(index)}
          sliderWidth={width - 32}
          itemWidth={width - 32}
          renderItem={({ item, index }) => (
            <>
              <FastImage
                key={index}
                style={styles.image}
                resizeMode="cover"
                source={{ uri: item.profileImage }}
                progressiveRenderingEnabled={true}
                cache={FastImage.cacheControl.immutable}
                priority={FastImage.priority.normal}
              />
              <Text style={styles.role}>{item.role}</Text>
              <Text style={styles.name}>
                {item.name} - Intake {item.intake}, {item.department}
              </Text>
              <Text style={styles.quote}>{item.bio && item.bio}</Text>
            </>
          )}
        />
        <EmptyView />
      </ScrollView>
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
          currentPage="clubspages"
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
  image: {
    width: "100%",
    height: heightPixel(280),
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
    marginTop: pixelSizeVertical(2),
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
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  disclaimer: {
    marginTop: pixelSizeVertical(-18),
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#C6CDE2",
    marginBottom: pixelSizeVertical(20),
  },
  inactiveDot: {
    height: 10,
    width: 10,
    backgroundColor: "#546593",
    borderRadius: 50,
  },
  activeDot: {
    height: 10,
    width: 10,
    backgroundColor: "#C4FFF9",
    borderRadius: 50,
  },
});

export default ClubsMembers;
