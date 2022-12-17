import { HStack, VStack } from "native-base";
import { useEffect, useState } from "react";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import AppInput from "../AppInput";
import AppSubtitle from "../AppSubtitile";
import AppTitle from "../AppTitle";
import LogInButtons from "./LogInButtons";

const VerificationCode = ({ setState, state }: any) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    //change the focus of the input box
  }, [code, index]);
  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <AppTitle>Verify Your Phone</AppTitle>
        <AppSubtitle>
          We have sent you a verification code to your phone number. Please
          enter the code below.
        </AppSubtitle>
        {/** 4 input boxes that take signle digit as input and switch focus on index change**/}
        <HStack w="100%" h="50px" rounded="lg">
          {[0, 1, 2, 3].map((x) => (
            <AppInput
              width="20%"
              placeholder="-"
              value={code[x]}
              onChangeText={(text: string) => {
                setCode(code.slice(0, x).concat([text], code.slice(x + 1, 4)));
                setIndex(x + 1);
              }}
              maxLength={1}
              keyboardType="number-pad"
              isFocused={index === x}
            ></AppInput>
          ))}
        </HStack>
        <AppTitle>{code}</AppTitle>
        <LogInButtons
          state={state}
          setState={setState}
          onPress={undefined}
        ></LogInButtons>
      </VStack>
    </Animated.View>
  );
};

export default VerificationCode;
