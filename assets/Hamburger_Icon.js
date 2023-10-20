import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Hamburger_Icon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="33"
    height="23"
    viewBox="0 0 33 23"
    fill="none"
  >
    <Path
      d="M2.5 2.00391H31"
      stroke={props.colour ? props.colour : "#C4FFF9"}
      strokeWidth="4"
      strokeLinecap="square"
    />
    <Path
      d="M2.5 11.0039H31"
      stroke={props.colour ? props.colour : "#C4FFF9"}
      strokeWidth="4"
      strokeLinecap="square"
    />
    <Path
      d="M2.5 20.0039H31"
      stroke={props.colour ? props.colour : "#C4FFF9"}
      strokeWidth="4"
      strokeLinecap="square"
    />
  </Svg>
);
export default Hamburger_Icon;
