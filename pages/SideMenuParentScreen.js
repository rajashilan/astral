// This gist is part of a medium post - https://medium.com/p/8e03510b8cc1/

import React, { Component } from "react";
import { StyleSheet, Dimensions, Button } from "react-native";
import Modal from "react-native-modal";
import SideMenu from "./SideMenu";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  sideMenuStyle: {
    margin: 0,
    width: width * 0.75, // SideMenu width
  },
});

export default class SideMenuParentScreen extends Component {
  state = {
    isSideMenuVisible: false,
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerRight: (
        <Button onPress={params.toggleSideMenu} title="Toggle" color="#000" />
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      toggleSideMenu: this.toggleSideMenu,
    });
  }

  toggleSideMenu = () =>
    this.setState({ isSideMenuVisible: !this.state.isSideMenuVisible });

  callParentScreenFunction = () => {
    // If needed, can be  called
    // when pressed in the SideMenu
  };

  render() {
    return (
      // Other parts of our screen
      // Modal needs to be included
      // Visible only when toggleSideMenu is pressed
      <Modal
        isVisible={this.state.isModalVisible}
        onBackdropPress={this.toggleSideMenu} // Android back press
        onSwipeComplete={this.toggleSideMenu} // Swipe to discard
        animationIn="slideInLeft" // Has others, we want slide in from the left
        animationOut="slideOutLeft" // When discarding the drawer
        swipeDirection="left" // Discard the drawer with swipe to left
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.sideMenuStyle} // Needs to contain the width, 75% of screen width in our case
      >
        <SideMenu callParentScreenFunction={this.callParentScreenFunction} />
      </Modal>
    );
  }
}
