import React, { useEffect, useState } from "react";
import { Button, HStack, Image, Input, Stack, Text, VStack } from "native-base";
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
import { get, ref, update } from "firebase/database";
import db from "../firebase";

const WalletScreen = () => {
  const [value, setValue] = useState("");
  useEffect(() => {
    // const value = getValueFor("balance");
    // value.then((value: string) => {
    //   setValue(value);
    // });
    getBalance();
  }, []);

  useEffect(() => {}, [value]);

  async function getBalance() {
    let email = await getValueFor("email");
    //replace . with _ in email
    email = email.replace(".", "_");
    const balance = await fetch("http://157.230.188.72:8080/balance_of",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: email,
      }),
    })
    const balanceValue = await balance.json();
    console.log(balanceValue);
    setValue(balanceValue);
  }

  async function addFunds() {
    let email = await getValueFor("email");
    //replace . with _ in email
    email = email.replace(".", "_");
    const userRef = ref(db, "users/" + email+"/info");
    const balance = await get(userRef);
    const balanceValue = balance.val().balance;

    const mintTokens = await fetch("http://157.230.188.72:8080/mint_tokens"
    , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: email,
        amount: parseInt(value),
      }),

      
    });
    console.log(mintTokens);
    getBalance();
    

    if (!balanceValue) {
      update(userRef, {
        balance: parseInt(value),
      });
      return;
    }
    update(userRef, {
      balance: parseInt(value) + parseInt(balanceValue),
    });
  }
  return (
    <VStack bg="#060D16" w="100%" h="100%">
      <SafeAreaView>
        <VStack px="2">
          <Text
            my="2"
            color="yellow.300"
            fontSize="2xl"
            fontFamily="Poppins_700Bold"
            p="2"
          >
            Wallet
          </Text>
          <Text color="white">₹{value}</Text> 
          <Input color="white" w="100%" mx="auto" my="2" px={4} rounded="lg" value={value} onChangeText={(text) => setValue(text)}>
          
          
          </Input>
          
          <AppSubtitle>Avialable Balance</AppSubtitle>
        </VStack>
        <VStack mx="auto" paddingTop={"10"}>
          <WithrawDipositToggle />
          <PaymentMethods />
        </VStack>
        <TouchableOpacity onPress={addFunds}>
          <Text>Add Funds</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </VStack>
  );
};

const WithrawDipositToggle = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <HStack w="100%" h="40px" mx="auto" my="2" px={4} rounded="lg">
        <Button
          bg={toggle ? "#193F60" : "#12202E"}
          width={"50%"}
          onPress={() => setToggle(true)}
        >
          Add Funds
        </Button>
        <Button
          bg={toggle ? "#12202E" : "#193F60"}
          width={"50%"}
          onPress={() => setToggle(false)}
        >
          Withdraw Funds
        </Button>
      </HStack>
      <VStack bg="#12202E" rounded={"lg"} mx="4" my="4">
        <HStack justifyContent="space-evenly"></HStack>
        {toggle ? <AddFunds /> : <WithdrawFunds />}
      </VStack>
    </>
  );
};

const AddFunds = () => {
  const [value, setValue] = useState("0");
  let amounts = ["100", "500", "1000", "5000", "10000"];
  return (
    <VStack bg="rgba(0,0,0,0)">
      <VStack p="4">
        <HStack w="100%" h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            placeholder="Enter Amount"
            value={value}
            width="75%"
          ></AppInput>
          <AppButton onPress={() => setValue("0")} width="20%" secondary={true}>
            Clear
          </AppButton>
        </HStack>
        <HStack w="100%" h="25px" mx="auto" my="1">
          {amounts.map((amount, i) => (
            <Button
              key={i}
              onPress={() =>
                setValue((parseFloat(value) + parseFloat(amount)).toString())
              }
              variant="outline"
              rounded="full"
              mx=".5"
              py="0"
              borderColor="#8EF140"
              _text={{ color: "#8EF140", fontSize: "12px" }}
            >
              {"+ " + amount}
            </Button>
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
        <AppTitle>₹{value}</AppTitle>
      </VStack>
    </VStack>
  );
};

const PaymentMethods = () => {
  return (
    <VStack bg="rgba(0,0,0,0)" p="4">
      <VStack mt="4">
        <AppSubtitle>Select Payment Methods</AppSubtitle>
        <VStack space="5" mt="4">
          <HStack space="5">
            <Image
              alt="upi"
              source={require("../assets/upi.webp")}
              w="8"
              h="8"
            />
            <Text color="white" fontSize="md" fontFamily="Poppins_400Regular">
              UPI
            </Text>
          </HStack>
          <HStack space="5">
            <Image
              alt="upi"
              source={require("../assets/upi.webp")}
              w="8"
              h="8"
            />
            <Text color="white" fontSize="md" fontFamily="Poppins_400Regular">
              UPI Apps
            </Text>
          </HStack>
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
          <HStack space="5">
            <Image
              alt="e-rupee"
              source={require("../assets/er.png")}
              width="8"
              height="6"
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
