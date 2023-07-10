// This gist is part of a medium post - https://medium.com/p/8e03510b8cc1/
import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { Image } from "expo-image";

import closeIcon from "../assets/close_icon.png";
import {
  pixelSizeVertical,
  pixelSizeHorizontal,
  fontPixel,
} from "../utils/responsive-font";

export default class SideMenu extends React.Component {
  state = {
    toggle_option_one: false,
    navigations: [
      {
        name: "orientation",
      },
      {
        name: "clubs",
      },
      {
        name: "department",
      },
      {
        name: "profile",
      },
      {
        name: "staff list",
      },
    ],
  };

  callParentScreenFunction = () => this.props.callParentScreenFunction();

  handleMenuNavigation = (name) => {
    this.callParentScreenFunction();
    const menuItem = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === "staff list") this.props.navigation.replace("Stafflist");
    else this.props.navigation.replace(menuItem.trim());
  };

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.closeContainer}>
          <Pressable
            onPress={this.callParentScreenFunction}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Image
              style={styles.closeIcon}
              source={closeIcon}
              contentFit="contain"
            />
          </Pressable>
        </View>

        <FlatList
          style={styles.list}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={this.state.navigations}
          renderItem={({ item }) => (
            <>
              <Pressable onPress={() => this.handleMenuNavigation(item.name)}>
                <Text
                  style={
                    this.props.currentPage === item.name
                      ? styles.activeMenuItem
                      : styles.inactiveMenuItem
                  }
                >
                  {item.name}
                </Text>
              </Pressable>
              <View style={styles.emptyView}></View>
            </>
          )}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#363BB1",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  closeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: pixelSizeVertical(24),
    marginBottom: pixelSizeVertical(28),
  },
  closeIcon: {
    height: pixelSizeVertical(25),
    width: pixelSizeHorizontal(40),
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#363BB1",
  },
  inactiveMenuItem: {
    fontSize: fontPixel(52),
    fontWeight: 400,
    color: "#07BEB8",
  },
  activeMenuItem: {
    fontSize: fontPixel(52),
    fontWeight: 700,
    color: "#C4FFF9",
  },
});
