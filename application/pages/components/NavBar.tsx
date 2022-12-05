import { VStack, CircleIcon } from "native-base";
import React from "react";
import ColorModeSwitch from "./ColorModeSwitch";

const NavBar = () => {
  return (
    <VStack
      _dark={{
        bg: "blueGray.900",
      }}
      _light={{
        bg: "#2252D0",
      }}
      h="100vh"
      w="32"
    >
      <ColorModeSwitch />
    </VStack>
  );
};

export default NavBar;
