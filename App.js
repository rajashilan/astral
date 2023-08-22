import "react-native-gesture-handler";
import { StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TransitionPresets } from "@react-navigation/stack";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import SignupDetails from "./pages/SignupDetails";
import SignupExtra from "./pages/SignupExtra";
import ForgotPassword from "./pages/ForgotPassword";

import Orientation from "./pages/Orientation";
import OrientationPages from "./pages/OrientationPages";
import Clubs from "./pages/Clubs";
import ClubsPages from "./pages/ClubsPages";
import Department from "./pages/Department";
import Profile from "./pages/Profile";
import Stafflist from "./pages/Stafflist";
import Stafflistpage from "./pages/Stafflistpage";
import CreateAClub from "./pages/CreateAClub";
import ClubResubmission from "./pages/ClubResubmisson";
import ClubsYou from "./pages/ClubsYou";
import AddClubsGallery from "./pages/AddClubsGallery";
import AddClubsEvent from "./pages/AddClubsEvent";

import { Provider } from "react-redux";
import { store } from "./src/redux/store";

const Stack = createStackNavigator();

const animationConfig = {
  animation: "timing",
  config: { duration: 0 },
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: () => null,
          }}
          initialRouteName="Main"
        >
          <Stack.Screen
            name="Main"
            component={Main}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              transitionSpec: {
                open: animationConfig,
                close: animationConfig,
              }, // added
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              transitionSpec: {
                open: animationConfig,
                close: animationConfig,
              }, // added
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              transitionSpec: {
                open: animationConfig,
                close: animationConfig,
              }, // added
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="SignupDetails"
            component={SignupDetails}
            options={{
              transitionSpec: {
                open: animationConfig,
                close: animationConfig,
              }, // added
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="SignupExtra"
            component={SignupExtra}
            options={{
              transitionSpec: {
                open: animationConfig,
                close: animationConfig,
              }, // added
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Orientation"
            component={Orientation}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="OrientationPages"
            component={OrientationPages}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Clubs"
            component={Clubs}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="ClubsPages"
            component={ClubsPages}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="ClubResubmission"
            component={ClubResubmission}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="ClubsYou"
            component={ClubsYou}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="AddClubsGallery"
            component={AddClubsGallery}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="AddClubsEvent"
            component={AddClubsEvent}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Department"
            component={Department}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Stafflist"
            component={Stafflist}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Stafflistpage"
            component={Stafflistpage}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="CreateAClub"
            component={CreateAClub}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Test"
            component={Test}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});
