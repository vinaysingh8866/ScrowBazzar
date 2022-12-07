import { Center, HStack, Stack, VStack, ZStack } from "native-base"
import ColorModeSwitch from "./ColorModeSwitch"
import NavBar from "./NavBar"
import React, { useState } from "react"
export default function PageSetup({ page, modal, children }:any) {
    const [showModal, setShowModal] = useState(false);
    return (
      <ZStack>
        <VStack>
          <NavBar />
          <Stack mx="auto" my="10">
          {children}
          </Stack>
        </VStack>
      </ZStack>
    );
  }
  