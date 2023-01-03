import React from "react";
import { ZStack, Stack } from "native-base";
const CircleComponent = ({ status, state }: any) => {
  return (
    <ZStack>
      <Stack
        bg={state ? "#09151E" : "#8EF140"}
        rounded={"full"}
        w="5"
        h="5"
        borderColor={state ? "#347D1B" : "#1D4A70"}
        borderWidth="2"
      ></Stack>
    </ZStack>
  );
};

export default CircleComponent;
