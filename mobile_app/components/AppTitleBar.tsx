import { FontAwesome } from "@expo/vector-icons";
import { Button, HStack, Text } from "native-base";

function AppTitleBar({
  title,
  back = false,
  onPress = () => {},
}: {
  title: string;
  back: boolean;
  onPress: any;
}) {
  return (
    <HStack mx="auto" w="100%" h="50px" ml={back ? 0 : 4}>
      {back && (
        <Button
          h="50px"
          w="50px"
          variant={"ghost"}
          alignSelf="center"
          onPress={onPress}
        >
          <FontAwesome name="angle-left" size={30} color="white" />
        </Button>
      )}
      <Text
        color={"#D9F1FF"}
        alignSelf="center"
        fontFamily={"Poppins_500Medium"}
        fontSize={"18"}
      >
        {title}
      </Text>
    </HStack>
  );
}

export default AppTitleBar;
