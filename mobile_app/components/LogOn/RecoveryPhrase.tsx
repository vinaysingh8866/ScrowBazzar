import { HStack, VStack } from "native-base";
import { SetStateAction, useState } from "react";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import AppInput from "../AppInput";
import AppSubtitle from "../AppSubtitile";
import AppTitle from "../AppTitle";
import LogInButtons from "./LogInButtons";

const RecoveryPhrase = ({ setState, state }: any) => {
  const [phrase, setPhrase] = useState("");

  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <AppTitle>Recovery Phrase</AppTitle>
        <AppSubtitle>
          Please copy and save your recovery phrase below.
        </AppSubtitle>
        <HStack h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            secondary
            width="100%"
            placeholder="Recovery Phrase"
            value={phrase}
            onChangeText={(text: SetStateAction<string>) => setPhrase(text)}
            keyboardType={undefined}
            maxLength={0}
            isFocused={undefined}
          ></AppInput>
        </HStack>
        <LogInButtons
          state={state}
          setState={setState}
          onPress={undefined}
        ></LogInButtons>
      </VStack>
    </Animated.View>
  );
};

export default RecoveryPhrase;
