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
import ClubResubmission from "./pages/ClubResubmission";
import ClubsYou from "./pages/ClubsYou";
import AddClubsGallery from "./pages/AddClubsGallery";
import AddClubsEvent from "./pages/AddClubsEvent";
import EditClub from "./pages/EditClub";
import ClubCurrentMembers from "./pages/ClubCurrentMembers";
import ClubMembersRequest from "./pages/ClubMembersRequest";
import EditClubMember from "./pages/EditClubMember";
import EditClubRoles from "./pages/EditClubRoles";
import Notifications from "./pages/Notifications";
import GeneralForms from "./pages/GeneralForms";
import GeneralFormsPage from "./pages/GeneralFormsPages";
import ResubmitClubsEvent from "./pages/ResubmitClubsEvent";
import ResubmitClubsGallery from "./pages/ResubmitClubsGallery";

import { Provider } from "react-redux";
import { store } from "./src/redux/store";

import { firebase } from "@react-native-firebase/app-check";

const Stack = createStackNavigator();

const firebaseAppCheckToken = async () => {
  try {
    const appCheck = await firebase.appCheck();

    const rnfbProvider = appCheck.newReactNativeFirebaseAppCheckProvider();

    rnfbProvider.configure({
      android: {
        provider: __DEV__ ? "debug" : "playIntegrity",
        debugToken: "FC26A58E-03DE-4B9A-A1AE-6ED5C12C1606",
      },
      apple: {
        provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
        debugToken: "xxxx-xxxx-xxxx",
      },
    });

    await appCheck.initializeAppCheck({
      provider: rnfbProvider,
      isTokenAutoRefreshEnabled: true,
    });

    const appCheckTokenFB = await appCheck.getToken();

    const [{ isTokenValid }] = await sendTokenToApi({
      appCheckToken: appCheckTokenFB.token,
    });

    if (isTokenValid) {
      // Perform Action for the legal device
    } else {
      // Perform Action for illegal device
    }
  } catch (e) {
    // Handle Errors which can happen during token generation
    console.log(e);
  }
};

firebaseAppCheckToken();

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
            name="ResubmitClubsGallery"
            component={ResubmitClubsGallery}
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
            name="ResubmitClubsEvent"
            component={ResubmitClubsEvent}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="EditClub"
            component={EditClub}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="ClubCurrentMembers"
            component={ClubCurrentMembers}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="ClubMembersRequest"
            component={ClubMembersRequest}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="EditClubMember"
            component={EditClubMember}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="EditClubRoles"
            component={EditClubRoles}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="GeneralForms"
            component={GeneralForms}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="GeneralFormsPage"
            component={GeneralFormsPage}
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
