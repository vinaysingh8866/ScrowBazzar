import { HStack, VStack } from "native-base";
import { SetStateAction, useState } from "react";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import AppInput from "../AppInput";
import AppSubtitle from "../AppSubtitile";
import AppTitle from "../AppTitle";
import LogInButtons from "./LogInButtons";

const CreateWalletPin = ({ setState, state }: any) => {
  const [pin, setPin] = useState("");

  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <AppTitle>Create Wallet Pin</AppTitle>
        <AppSubtitle>
          Please enter a 4 digit pin to secure your wallet.
        </AppSubtitle>
        <HStack h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            width="100%"
            secondary
            placeholder="Pin"
            value={pin}
            onChangeText={(text: SetStateAction<string>) => setPin(text)}
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

export default CreateWalletPin;
