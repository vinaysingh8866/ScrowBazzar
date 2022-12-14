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
      bg={secondary ? "#1D3647" : "#4030FB"}
      w={width}
      h="50px"
      mx="auto"
      rounded="md"
    >
      {children}
    </Button>
  );
}

export default AppButton;
