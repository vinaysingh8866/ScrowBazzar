import { Button, HStack, VStack } from "native-base";
import { useState } from "react";
import AppToggle from "../AppToggle";
import AddFunds from "./Addfunds";
import WithdrawFunds from "./WithdrawFunds";

const WithrawDipositToggle = ({ value, setValue, balance }: any) => {
  const [toggle, setToggle] = useState(true);
  return (
    <AppToggle
      toggle={toggle}
      setToggle={setToggle}
      option1="Add Funds"
      option2="Withdraw Funds"
    >
      {toggle ? (
        <AddFunds value={value} setValue={setValue} />
      ) : (
        <WithdrawFunds balance={balance} />
      )}
    </AppToggle>
  );
};

export default WithrawDipositToggle;
