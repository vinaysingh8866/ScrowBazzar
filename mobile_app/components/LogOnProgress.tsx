import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { NativeBaseProvider, Box, VStack, HStack, Stack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import LogOnComponentSetup from "./LogOn/LogOnComponentSetup";
import { useEffect } from "react";

const LogOnProgress = ({ state }: any) => {
  //function to change the color of the dots
  const changeColor = (index: number) => {
    if (index <= state) {
      return "white";
    } else {
      return "rgba(255, 255, 255, 0.3)";
    }
  };

  useEffect(() => {
    //change the color of the dots
  }, [state]);

  //return the dots
  return (
    <HStack mx="auto" space="4" my="20%" h="5">
      <Stack w="4" h="4" bg={changeColor(0)} rounded="full"></Stack>
      <Stack w="4" h="4" bg={changeColor(1)} rounded="full"></Stack>
      <Stack w="4" h="4" bg={changeColor(2)} rounded="full"></Stack>
      <Stack w="4" h="4" bg={changeColor(3)} rounded="full"></Stack>
      <Stack w="4" h="4" bg={changeColor(4)} rounded="full"></Stack>
      <Stack w="4" h="4" bg={changeColor(5)} rounded="full"></Stack>
      <Stack w="4" h="4" bg={changeColor(6)} rounded="full"></Stack>
    </HStack>
  );
};

export default LogOnProgress;
