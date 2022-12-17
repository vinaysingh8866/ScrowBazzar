import { HStack, VStack } from "native-base";
import { useEffect } from "react";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import AppInput from "../AppInput";
import AppSubtitle from "../AppSubtitile";
import AppTitle from "../AppTitle";
import LogInButtons from "./LogInButtons";

const PhoneNumberVerification = ({ setState, state }: any) => {
    useEffect(() => {}, [state]);
  
    return (
      <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
        <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
          <AppTitle>Verify Your Phone</AppTitle>
          <AppSubtitle>
            We will send you a verification code to your phone number. Please
            enter your phone number below.
          </AppSubtitle>
          <HStack w="100%" my="4" h="50px" mx="auto" rounded="lg">
            <AppInput width="100%" placeholder="Phone Number" keyboardType={undefined} maxLength={0} value={undefined} onChangeText={undefined} isFocused={undefined}></AppInput>
          </HStack>
          <LogInButtons state={state} setState={setState} onPress={undefined}></LogInButtons>
        </VStack>
      </Animated.View>
    );
  };

    export default PhoneNumberVerification;