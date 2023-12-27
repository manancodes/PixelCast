import { Text, TextProps } from "./Themed";

export function PixelifyText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "Pixelify" }]} />;
}
