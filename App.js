import "react-native-reanimated";
import "react-native-gesture-handler";
import { firebase } from "@react-native-firebase/app-check";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Provider } from "react-redux";

import AddClubsEvent from "./pages/AddClubsEvent";
import AddClubsGallery from "./pages/AddClubsGallery";
import ClubCurrentMembers from "./pages/ClubCurrentMembers";
import ClubMembersRequest from "./pages/ClubMembersRequest";
import ClubResubmission from "./pages/ClubResubmission";
import Clubs from "./pages/Clubs";
import ClubsPages from "./pages/ClubsPages";
import ClubsYou from "./pages/ClubsYou";
import CreateAClub from "./pages/CreateAClub";
import EditClub from "./pages/EditClub";
import EditClubMember from "./pages/EditClubMember";
import EditClubRoles from "./pages/EditClubRoles";
import ForgotPassword from "./pages/ForgotPassword";
import GeneralForms from "./pages/GeneralForms";
import GeneralFormsPage from "./pages/GeneralFormsPages";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Notifications from "./pages/Notifications";
import Orientation from "./pages/Orientation";
import OrientationPages from "./pages/OrientationPages";
import Account from "./pages/Account";
import ResubmitClubsEvent from "./pages/ResubmitClubsEvent";
import ResubmitClubsGallery from "./pages/ResubmitClubsGallery";
import Signup from "./pages/Signup";
import SignupDetails from "./pages/SignupDetails";
import { store } from "./src/redux/store";
import * as Updates from "expo-updates";
import { NotificationProvider } from "./context/NotificationContext";
import * as ExpoNotifications from "expo-notifications";
import Feedback from "./pages/Feedback";
import ClubRenewal from "./pages/ClubRenewal";
import ClubsOnboarding from "./pages/ClubsOnboarding";

const Stack = createStackNavigator();

const firebaseAppCheckToken = async () => {
  try {
    const appCheck = await firebase.appCheck();

    const rnfbProvider = appCheck.newReactNativeFirebaseAppCheckProvider();

    rnfbProvider.configure({
      android: {
        provider: __DEV__ ? "debug" : "playIntegrity",
        debugToken: "",
      },
      apple: {
        provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
        debugToken: "",
      },
    });

    await appCheck.initializeAppCheck({
      provider: rnfbProvider,
      isTokenAutoRefreshEnabled: true,
    });

    try {
      const { token } = await appCheck.getToken(true);

      if (token.length > 0) {
        console.log("AppCheck verification passed");
      }
    } catch (error) {
      console.log("AppCheck verification failed", error);
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
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  ExpoNotifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  return (
    <Provider store={store}>
      <NavigationContainer
        theme={{
          dark: true,
          colors: { background: "#0C111F" },
        }}
      >
        <NotificationProvider>
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
                transitionSpec: {
                  open: animationConfig,
                  close: animationConfig,
                }, // added
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
              name="Home"
              component={Home}
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
              name="Orientation"
              component={Orientation}
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
              name="OrientationPages"
              component={OrientationPages}
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
              name="Clubs"
              component={Clubs}
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
              name="ClubsPages"
              component={ClubsPages}
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
              name="ClubResubmission"
              component={ClubResubmission}
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
              name="ClubsYou"
              component={ClubsYou}
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
              name="AddClubsGallery"
              component={AddClubsGallery}
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
              name="ResubmitClubsGallery"
              component={ResubmitClubsGallery}
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
              name="AddClubsEvent"
              component={AddClubsEvent}
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
              name="ResubmitClubsEvent"
              component={ResubmitClubsEvent}
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
              name="EditClub"
              component={EditClub}
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
              name="ClubCurrentMembers"
              component={ClubCurrentMembers}
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
              name="ClubMembersRequest"
              component={ClubMembersRequest}
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
              name="EditClubMember"
              component={EditClubMember}
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
              name="EditClubRoles"
              component={EditClubRoles}
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
              name="ClubRenewal"
              component={ClubRenewal}
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
              name="Notifications"
              component={Notifications}
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
              name="GeneralForms"
              component={GeneralForms}
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
              name="GeneralFormsPage"
              component={GeneralFormsPage}
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
              name="Account"
              component={Account}
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
              name="CreateAClub"
              component={CreateAClub}
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
              name="Feedback"
              component={Feedback}
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
              name="ClubsOnboarding"
              component={ClubsOnboarding}
              options={{
                transitionSpec: {
                  open: animationConfig,
                  close: animationConfig,
                }, // added
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
          </Stack.Navigator>
        </NotificationProvider>
      </NavigationContainer>
    </Provider>
  );
}
