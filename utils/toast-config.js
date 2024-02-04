import { Platform } from "react-native";
import { BaseToast } from "react-native-toast-message";

import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from "./responsive-font";

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#1EE271",
        marginTop: Platform.OS === "ios" ? pixelSizeVertical(24) : 0,
      }}
      contentContainerStyle={{
        paddingHorizontal: pixelSizeHorizontal(16),
        backgroundColor: "#5A8B6F",
      }}
      text1NumberOfLines={5}
      text1Style={{
        fontSize: fontPixel(14),
        fontWeight: "400",
        color: "#DFE5F8",
      }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#ed3444",
        marginTop: Platform.OS === "ios" ? pixelSizeVertical(24) : 0,
      }}
      contentContainerStyle={{
        paddingHorizontal: pixelSizeHorizontal(16),
        backgroundColor: "#462024",
      }}
      text1Style={{
        fontSize: fontPixel(14),
        fontWeight: "400",
        color: "#DFE5F8",
      }}
      text1NumberOfLines={5}
    />
  ),
  neutral: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#C4FFF9",
        marginTop: Platform.OS === "ios" ? pixelSizeVertical(24) : 0,
      }}
      contentContainerStyle={{
        paddingHorizontal: pixelSizeHorizontal(16),
        backgroundColor: "#1C316A",
      }}
      text1Style={{
        fontSize: fontPixel(14),
        fontWeight: "400",
        color: "#DFE5F8",
      }}
      text1NumberOfLines={5}
    />
  ),
};

export { toastConfig };
