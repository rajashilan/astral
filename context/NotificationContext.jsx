import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationsAsync";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPushNotificationToken } from "../src/redux/actions/userActions";
import { useNavigation } from "@react-navigation/native";

const NotificationContext = createContext(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const notificationListener = useRef();
  const responseListener = useRef();
  const user = useSelector((state) => state.user);
  const userID = user.credentials.userId;
  const userCurrentPushNotificationToken =
    user.credentials.pushNotificationToken;

  useEffect(() => {
    if (userID) {
      registerForPushNotificationsAsync().then(
        (token) => {
          setExpoPushToken(token);
          console.log("userID: ", userID);
          console.log(
            "user's push notification token: ",
            userCurrentPushNotificationToken
          );
          if (
            (!userCurrentPushNotificationToken ||
              userCurrentPushNotificationToken !== token) &&
            userID
          ) {
            dispatch(updateUserPushNotificationToken(userID, token));
          }
        },
        (error) => setError(error)
      );

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log(
            "🔔 Notification Received while the app is running: ",
            notification
          );
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(
            "🔔 Notification Response user has interacted: ",
            JSON.stringify(response, null, 2),
            JSON.stringify(response.notification.request.content.data, null, 2)
          );
          const item = response.notification.request.content.data;
          // Handle the notification response here (direct the user to the appropriate page)
          // if (item.sourceDestination) {
          //   if (item.sourceDestination === "ClubsPages") {
          //     navigation.navigate("ClubsPages", {
          //       clubID: item.sourceID,
          //     });
          //   } else if (item.sourceDestination === "Clubs") {
          //     navigation.navigate("Clubs");
          //   }
          // }
          navigation.navigate("Notifications");
        });

      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
        }
      };
    }
  }, [userID]);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
