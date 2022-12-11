import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import {
  NativeBaseProvider,
  Box,
  VStack,
  ChevronUpIcon,
  InfoIcon,
} from "native-base";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LogOn from "./pages/LogOn";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
const Tab = createBottomTabNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [state, setState] = useState(0);
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {state < 6 && <LogOn state={state} setState={setState} />}
        {state >= 6 && <MyTabs />}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#639426",
        tabBarStyle: {
          backgroundColor: "#12202E",
          borderTopColor: "#060D16",
          borderTopWidth: 0,
          height: 90,

          paddingTop: 10,
          shadowColor: "#060D16",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <ChevronUpIcon size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={HomeScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <InfoIcon size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function HomeScreen() {
  return (
    <VStack bg="#060D16" w="100%" h="100%">
      <Text>Home!</Text>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
