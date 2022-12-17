import { VStack } from "native-base";
import { useEffect, useState } from "react";
import { getValueFor } from "../../utils/Storage";
import AppTitle from "../AppTitle";

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

export default WithdrawFunds;