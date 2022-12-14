import React, { useEffect, useState } from "react";
import { HStack, Image, Input, Stack, Text, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { getValueFor } from "../utils/Storage";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableHighlight, TouchableOpacity } from "react-native";

import AppTitle from "../components/AppTitle";
import AppSubtitle from "../components/AppSubtitile";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";

const WalletScreen = () => {
  const [value, setValue] = useState("");
  useEffect(() => {
    const value = getValueFor("balance");
    value.then((value: string) => {
      setValue(value);
    });
  }, []);
  return (
    <VStack bg="#060D16" w="100%" h="100%">
      <SafeAreaView>
        <VStack p="4">
          <Text
            my="2"
            color="yellow.300"
            fontSize="2xl"
            fontFamily="Poppins_700Bold"
          >
            Wallet
          </Text>
          <Text
            mt="2"
            color="yellow.300"
            fontSize="2xl"
            fontFamily="Poppins_700Bold"
          >
            ₹ {value}
          </Text>
          <Text mt="-2" color="rgba(255,255,255,0.5)">
            Avialable Balance
          </Text>
        </VStack>
        <VStack mx="auto">
          <WithrawDipositToggle />
          <PaymentMethods />
        </VStack>
      </SafeAreaView>
    </VStack>
  );
};

const WithrawDipositToggle = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <VStack bg="#193F60" rounded={"lg"} my="2">
      <HStack justifyContent="space-evenly">
        <TouchableOpacity onPress={() => setToggle(true)}>
          <Animated.View
            style={{
              backgroundColor: toggle ? "#639426" : "#060D16",
              width: 150,
              height: 50,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              margin: 10,
              shadowColor: "#060D16",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text color={toggle ? "white" : "rgba(255,255,255,0.5)"}>
              Add Funds
            </Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setToggle(false)}>
          <Animated.View
            style={{
              backgroundColor: toggle ? "#060D16" : "#639426",
              width: 150,
              height: 50,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              margin: 10,
              shadowColor: "#060D16",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text color={toggle ? "rgba(255,255,255,0.5)" : "white"}>
              Withdraw Funds
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </HStack>
      {toggle ? <AddFunds /> : <WithdrawFunds />}
    </VStack>
  );
};

const AddFunds = () => {
  const [value, setValue] = useState("");
  let amounts = ["100", "500", "1000", "5000", "10000"];
  return (
    <VStack bg="rgba(0,0,0,0)">
      <VStack p="4">
        <Text
          my="2"
          color="yellow.300"
          fontSize="2xl"
          fontFamily="Poppins_700Bold"
        >
          Add Funds
        </Text>
        <HStack w="100%" h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            placeholder="Enter Amount"
            value={value}
            width="75%"
          ></AppInput>
          <AppButton onPress={() => setValue("0")} width="20%">
            Clear
          </AppButton>
        </HStack>
        <HStack>
          {amounts.map((amount, i) => (
            <TouchableOpacity
              key={i}
              onPress={() =>
                setValue((parseFloat(value) + parseFloat(amount)).toString())
              }
            >
              <Animated.View
                style={{
                  backgroundColor: value === amount ? "#639426" : "#060D16",
                  height: 25,
                  borderRadius: 10,
                  paddingHorizontal: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 5,
                  shadowColor: "#060D16",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Text
                  color={value === amount ? "white" : "rgba(255,255,255,0.5)"}
                >
                  ₹ {amount}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
};

const WithdrawFunds = () => {
  const [value, setValue] = useState("");
  useEffect(() => {
    const value = getValueFor("balance");
    value.then((value: string) => {
      setValue(value);
    });
  }, []);

  return (
    <VStack bg="rgba(0,0,0,0)">
      <VStack p="4">
        <Text
          my="2"
          color="yellow.300"
          fontSize="2xl"
          fontFamily="Poppins_400Regular"
        >
          Withdraw ₹{value}
        </Text>
      </VStack>
    </VStack>
  );
};

const PaymentMethods = () => {
  return (
    <VStack bg="rgba(0,0,0,0)">
      <VStack mt="4">
        <Text color="blue.300" fontSize="md" fontFamily="Poppins_400Regular">
          Select Payment Methods
        </Text>

        <VStack space="3">
          <HStack>
            <Image
              alt="upi"
              source={require("../assets/upi.webp")}
              w="10"
              h="10"
            />
            <Text color="white" fontSize="md" fontFamily="Poppins_400Regular">
              UPI
            </Text>
          </HStack>
          <HStack>
            <Image
              alt="upi"
              source={require("../assets/upi.webp")}
              w="10"
              h="10"
            />
            <Text color="white" fontSize="md" fontFamily="Poppins_400Regular">
              UPI Apps
            </Text>
          </HStack>
          <HStack>
            <Stack pl="2" w="10" h="10">
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
          <HStack>
            <Image
              alt="e-rupee"
              source={require("../assets/er.png")}
              width="5"
              height="5"
            />

            <Text color="white" fontSize="md" fontFamily="Poppins_400Regular">
              e-₹
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default WalletScreen;
