import React, { useEffect, useState } from "react";
import { Text, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { getValueFor } from "../utils/Storage";
import AppSubtitle from "../components/AppSubtitile";
import { onValue, ref} from "firebase/database";
import db from "../firebase";
import { addFundsToContract } from "../utils/Contract";
import WithrawDipositToggle from "../components/wallet/WithrawDipositToggle";
import PaymentMethods from "../components/wallet/PaymentMethods";

const WalletScreen = () => {
  const [value, setValue] = useState(0);
  const [balance, setBalance] = useState("");
  useEffect(() => {
    getBalance();
  }, []);

  useEffect(() => {
    
  }, [value]);

  async function getBalance() {
    let email = await getValueFor("email");
    email = email.replace(".", "_");
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
    )
  }

  async function addFunds() {
    if(value === 0) return;
    addFundsToContract(value)
    getBalance();
    setValue(0);
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
          <Text color="white" fontFamily="Poppins_400Regular" fontSize={"xl"}>e-₹ {balance}</Text>

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


export default WalletScreen;
