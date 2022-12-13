import { Button } from "native-base";

function AppButton({
  width,
  children,
  onPress,
}: {
  width: string;
  children: any;
  onPress: any;
}) {
  return (
    <Button
      onPress={onPress}
      bg="#4030FB"
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
