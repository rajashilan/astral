import React, { forwardRef, useRef, useImperativeHandle } from "react";
import SelectDropdown from "react-native-select-dropdown";
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
} from "../utils/responsive-font";
import { StyleSheet, Text, View } from "react-native";

const CustomSelectDropdown = forwardRef((props, ref) => {
  const {
    data,
    onSelect,
    defaultText,
    loadingText,
    loading,
    customDropdownButtonStyle,
    customDropDownButtonTxtStyle,
  } = props;
  const dropdownRef = useRef(null); // Local ref for SelectDropdown

  // Expose the reset function through the forwarded ref
  useImperativeHandle(ref, () => ({
    reset: () => {
      dropdownRef.current?.reset(); // Call the built-in reset function
    },
  }));

  return (
    <SelectDropdown
      ref={dropdownRef} // Attach the local ref here
      data={data}
      onSelect={onSelect}
      disabled={loading}
      renderButton={(selectedItem, isOpened) => (
        <View style={[styles.dropdownButtonStyle, customDropdownButtonStyle]}>
          <Text
            style={[
              styles.dropdownButtonTxtStyle,
              customDropDownButtonTxtStyle,
            ]}
          >
            {loading ? loadingText : selectedItem ? selectedItem : defaultText}
          </Text>
        </View>
      )}
      renderItem={(item, index, isSelected) => (
        <View
          style={{
            ...styles.dropdownItemStyle,
            ...(isSelected && { backgroundColor: "#C4FFF9" }),
          }}
        >
          <Text
            style={{
              ...styles.dropdownItemTxtStyle,
              ...(isSelected && {
                color: "#0C111F",
              }),
            }}
          >
            {item}
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
});

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: heightPixel(58),
    backgroundColor: "#1A2238",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: pixelSizeVertical(10),
    paddingHorizontal: pixelSizeVertical(16),
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    textAlign: "left",
    lineHeight: 24,
  },
  dropdownMenuStyle: {
    backgroundColor: "#1A2238",
    borderRadius: 5,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A2238",
    borderBottomWidth: 0,
    paddingHorizontal: pixelSizeVertical(16),
    paddingVertical: pixelSizeVertical(12),
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    textAlign: "left",
  },
});

export default CustomSelectDropdown;

{
  /* <CustomSelectDropdown
  data={colleges}
  onSelect={(selectedItem, index) => {
    setSelectedCollege(selectedItem);
  }}
  defaultText="Select your college"
  loadingText="Loading colleges..."
  loading={loadingColleges}
/>; */
}
