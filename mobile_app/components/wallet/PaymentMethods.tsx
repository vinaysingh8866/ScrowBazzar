import { FontAwesome } from "@expo/vector-icons";
import { HStack, Image, Stack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import AppSubtitle from "../AppSubtitile";

const PaymentMethods = ({ addFunds }: any) => {
  return (
    <VStack bg="rgba(0,0,0,0)" p="4">
      <VStack mt="4">
        <AppSubtitle>Select Payment Methods</AppSubtitle>
        <VStack space="5" mt="4">
          <TouchableOpacity onPress={addFunds}>
            <HStack space="5">
              <Image
                alt="upi"
                source={require("../../assets/upi.webp")}
                w="8"
                h="8"
              />
              <Text color="white" fontSize="md" fontFamily="Poppins_400Regular">
                UPI
              </Text>
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity onPress={addFunds}>
            <HStack space="5">
              <Stack pl="1" w="8" h="8">
                <FontAwesome
                  name="bank"
                  size={24}
                  color="rgba(255,255,255,0.5)"
                />
              </Stack>
              <Text color="white" fontSize="md" fontFamily="Poppins_400Regular">
                NEFT/RTGS
              </Text>
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity onPress={addFunds}>
            <HStack space="5">
              <Image
                alt="e-rupee"
                source={require("../../assets/rupay.png")}
                width="8"
                height="5"
              />

              <Text color="white" fontSize="md" fontFamily="Poppins_400Regular">
                Rupay
              </Text>
            </HStack>
          </TouchableOpacity>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default PaymentMethods;
