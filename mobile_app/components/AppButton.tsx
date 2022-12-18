import { Button } from "native-base";

function AppButton({
  width = "100%",
  children,
  onPress,
  secondary = false,
}: {
  width: string;
  children: any;
  onPress: any;
  secondary: boolean;
}) {
  return (
    <Button
      onPress={onPress}
      bg={secondary ? "#193F60" : "#4030FB"}
      w={width}
      h="50px"
      mx="auto"
      rounded="md"
      _text={{ color: "#fff", fontSize: "16px", fontWeight: "400" }}
    >
      {children}
    </Button>
  );
}

export default AppButton;
