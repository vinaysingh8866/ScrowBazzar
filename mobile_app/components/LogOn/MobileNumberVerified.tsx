import { Image, Stack, VStack } from "native-base";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import AppSubtitle from "../AppSubtitile";
import AppTitle from "../AppTitle";
import LogInButtons from "./LogInButtons";

const MobileNumberVerified = ({ setState, state }: any) => {
  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <AppTitle>Number Is Verified</AppTitle>
        <Stack mx="auto">
          <Image source={require("../../assets/mobile.png")}></Image>
        </Stack>
        <AppSubtitle>
          Your phone number has been verified. Please enter your details on next
          page.
        </AppSubtitle>
        <LogInButtons
          state={state}
          setState={setState}
          onPress={undefined}
        ></LogInButtons>
      </VStack>
    </Animated.View>
  );
};

export default MobileNumberVerified;
