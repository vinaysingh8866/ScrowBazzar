import { NativeBaseProvider, StatusBar } from "native-base";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LogBox } from "react-native";
import LogOn from "./pages/LogOn";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import Ionicons from "@expo/vector-icons/Ionicons";
import WalletScreen from "./pages/WalletScreen";
import { deleteValueFor, getValueFor } from "./utils/Storage";
import ProfileScreen, { uuidv4 } from "./pages/ProfileScreen";
import OrderScreen from "./pages/OdersScreen";
import HomeScreen from "./pages/HomeScreen";
const Tab = createBottomTabNavigator();
// deleteValueFor("name");
LogBox.ignoreAllLogs();

export default function App() {
  const [state, setState] = useState(0);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // if (!fontsLoaded) {
  //   return null;
  // }
  useEffect(() => {
    const value = getValueFor("name");
    value.then((value: string) => {
      if (value !== "0") setState(6);
    });
  }, []);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#060D16" barStyle="light-content" />

        {fontsLoaded ? (
          <>
            {state < 6 && <LogOn state={state} setState={setState} />}
            {state >= 6 && <AppTabs />}
          </>
        ) : null}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

function AppTabs() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  return (
    <>
      {fontsLoaded && (
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
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="Wallet"
            component={WalletScreen}
            options={{
              tabBarLabel: "Wallet",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="wallet" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Orders"
            component={OrderScreen}
            options={{
              tabBarLabel: "Orders",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: "Profile",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </>
  );
}
