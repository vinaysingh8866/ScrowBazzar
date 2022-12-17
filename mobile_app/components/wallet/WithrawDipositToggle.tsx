import { Button, HStack, VStack } from "native-base";
import { useState } from "react";
import AddFunds from "./Addfunds";
import WithdrawFunds from "./WithdrawFunds";

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

export default WithrawDipositToggle;
