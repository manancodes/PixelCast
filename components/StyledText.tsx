import { Text } from "react-native";

export function PixelifyText(props: any) {
  return <Text {...props} style={[props.style, { fontFamily: "Pixelify" }]} />;
}
