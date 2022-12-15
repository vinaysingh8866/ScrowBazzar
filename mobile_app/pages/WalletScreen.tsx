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
import { get, onValue, ref, update } from "firebase/database";
import db from "../firebase";

const WalletScreen = () => {
  const [value, setValue] = useState(0);
  const [balance, setBalance] = useState("");
  useEffect(() => {
    // const value = getValueFor("balance");
    // value.then((value: string) => {
    //   setValue(value);
    // });
    getBalance();
  }, []);

  useEffect(() => {
    
  }, [value]);

  async function getBalance() {
    let email = await getValueFor("email");
    //replace . with _ in email
    email = email.replace(".", "_");
    console.log(email);
    const userRef = ref(db, "users/" + email + "/info");
    onValue(
      userRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        if (data) {
          setBalance(data.balance);
        }
      },
      {
        onlyOnce: false,
      }
    );
    const b = await get(userRef);
    const balanceValue = b.val().balance;
    console.log(balanceValue);
    setBalance(balanceValue);

    const balance = await fetch("http://157.230.188.72:8080/balance_of", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: email,
      }),
    });
    if (balance.status === 200) {
      console.log(balance);
      const bValue = await balance.json();
      if (bValue.balance !== balanceValue) {
        update(userRef, {
          balance: bValue.balance,
        });
        setBalance(bValue.balance);
      }
    }
  }

  async function addFunds() {
    setValue(0);
    let email = await getValueFor("email");
    //replace . with _ in email
    email = email.replace(".", "_");
    const userRef = ref(db, "users/" + email + "/info");
    const balance = await get(userRef);
    const balanceValue = balance.val().balance;

    const mintTokens = await fetch("http://157.230.188.72:8080/mint_tokens", {
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
          <Text color="white">₹{balance}</Text>

          <AppSubtitle>Avialable Balance</AppSubtitle>
        </VStack>
        <VStack mx="auto" paddingTop={"10"}>
          <WithrawDipositToggle value={value} setValue={setValue} />
          <PaymentMethods addFunds={addFunds} />
        </VStack>
      </SafeAreaView>
    </VStack>
  );
};

const WithrawDipositToggle = ({ value, setValue }: any) => {
  const [toggle, setToggle] = useState(true);
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
        {toggle ? (
          <AddFunds value={value} setValue={setValue} />
        ) : (
          <WithdrawFunds />
        )}
      </VStack>
    </>
  );
};

const AddFunds = ({ value, setValue }: any) => {
  let amounts = ["100", "500", "1000", "5000", "10000"];
  return (
    <VStack bg="rgba(0,0,0,0)">
      <VStack p="2">
        <HStack h="50px" mx="auto" my="2" rounded="lg">
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
                source={require("../assets/upi.webp")}
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
                source={require("../assets/er.png")}
                width="8"
                height="6"
              />

              <Text color="white" fontSize="md" fontFamily="Poppins_400Regular">
                e-₹
              </Text>
            </HStack>
          </TouchableOpacity>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default WalletScreen;
