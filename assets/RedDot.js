import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const RedDot = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="28"
    viewBox="0 0 24 28"
    fill="none"
    style={{
      marginLeft: -8,
      marginBottom: -2,
      marginRight: -8,
    }}
  >
    {/* Use Circle instead of circle */}
    <Circle cx="18" cy="8" r="6" fill="#E03241" />
  </Svg>
);

export default RedDot;
