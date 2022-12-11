import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { NativeBaseProvider, Box, VStack, HStack, Stack, Button } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import LogOnComponentSetup from "../components/LogOnComponentSetup";
import LogOnProgress from "../components/LogOnProgress";
import { useState } from "react";

const LogOn = ({state, setState}: any) => {
    
  return (
    <VStack bg="#060D16" w="100%" h="100%">
        
      <LogOnProgress state={state}/>
      <LogOnComponentSetup setState={setState} state={state} />
      
    </VStack>
  );
};

export default LogOn;
