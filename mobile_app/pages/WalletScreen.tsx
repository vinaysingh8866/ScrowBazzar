import React, { useEffect, useState } from "react";
import { Text, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { getValueFor } from "../utils/Storage";
import AppSubtitle from "../components/AppSubtitile";
import { onValue, ref } from "firebase/database";
import db from "../firebase";
import { addFundsToContract } from "../utils/Contract";
import WithrawDipositToggle from "../components/wallet/WithrawDipositToggle";
import PaymentMethods from "../components/wallet/PaymentMethods";
import AppTitleBar from "../components/AppTitleBar";
import AppTitle from "../components/AppTitle";

const WalletScreen = () => {
  const [value, setValue] = useState(0);
  const [balance, setBalance] = useState("");
  useEffect(() => {
    getBalance();
  }, []);

  useEffect(() => {}, [value]);

  async function getBalance() {
    let email = await getValueFor("email");
    email = email.replace(".", "_");
    const userRef = ref(db, "users/" + email + "/info");
    onValue(
      userRef,
      (snapshot) => {
        const data = snapshot.val();
        //console.log(data);
        if (data) {
          setBalance(data.balance);
        }
      },
      {
        onlyOnce: false,
      }
    );
  }

  async function addFunds() {
    if (value === 0) return;
    addFundsToContract(value);
    getBalance();
    setValue(0);
  }
  return (
    <VStack bg="#060D16" w="100%" h="100%">
      <SafeAreaView>
        <AppTitleBar title="Wallet"></AppTitleBar>
        <VStack px="2" pt="2">
          <AppTitle>e₹ {balance}</AppTitle>
          <Text color={"#e4e4e4"} px="2">
            Available Balance
          </Text>
        </VStack>
        <VStack mx="auto" pt="4">
          <WithrawDipositToggle
            value={value}
            setValue={setValue}
            balance={balance}
          />
          <PaymentMethods addFunds={addFunds} />
        </VStack>
      </SafeAreaView>
    </VStack>
  );
};

export default WalletScreen;
