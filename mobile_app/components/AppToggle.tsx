import { Button, HStack, VStack } from "native-base";

function AppToggle({
  toggle,
  setToggle,
  option1,
  option2,
  children,
}: {
  toggle: boolean;
  setToggle: any;
  option1: string;
  option2: string;
  children: any;
}) {
  return (
    <>
      <HStack w="100%" h="40px" mx="auto" my="2" px={4} rounded="lg">
        <Button
          bg={toggle ? "#193F60" : "#12202E"}
          width={"50%"}
          onPress={() => setToggle(true)}
        >
          {option1}
        </Button>
        <Button
          bg={toggle ? "#12202E" : "#193F60"}
          width={"50%"}
          onPress={() => setToggle(false)}
        >
          {option2}
        </Button>
      </HStack>
      <VStack bg="#12202E" rounded={"lg"} mx="4" my="4">
        <HStack justifyContent="space-evenly"></HStack>
        {children}
      </VStack>
    </>
  );
}

export default AppToggle;
