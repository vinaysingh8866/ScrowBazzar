import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import {
  NativeBaseProvider,
  Box,
  VStack,
  ChevronUpIcon,
  InfoIcon,
  Text,
  ScrollView,
  HStack,
  Image,
  extendTheme,
  Modal,
  Button,
  Stack,
} from "native-base";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
import { SafeAreaView } from "react-native-safe-area-context";
import WalletScreen from "./pages/WalletScreen";
import { deleteValueFor, getValueFor } from "./utils/Storage";
import ProfileScreen from "./pages/ProfileScreen";
const Tab = createBottomTabNavigator();
//deleteValueFor("name");
export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [state, setState] = useState(0);

  useEffect(() => {
    const value = getValueFor("name");
    value.then((value: string) => {
      if (value !== "0") setState(6);
    });
  }, []);

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
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: "Wallet",
          tabBarIcon: ({ color, size }) => (
            <InfoIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderScreen}
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, size }) => (
            <InfoIcon size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <InfoIcon size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

import db from "./firebase";
import { get, onValue, push, ref } from "firebase/database";
import { FontAwesome } from "@expo/vector-icons";
import OrderPage from "./pages/OdersScreen";
import OrderScreen from "./pages/OdersScreen";
function HomeScreen() {
  const [services, setServices] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalService, setModalService] = useState<any>({});
  async function getMarketServices() {
    const services = ref(db, "marketServices/");

    onValue(
      services,
      (snapshot) => {
        let servicesArray: any[] = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          servicesArray.push(childData);
        });
        setServices(servicesArray);
      },
      {
        onlyOnce: false,
      }
    );
  }
  useEffect(() => {
    getMarketServices();
  }, []);

  return (
    <VStack bg="#060D16" w="100%" h="100%">
      <SafeAreaView>
        <Text
          color={modalVisible ? "white" : "transparent"}
          mx="auto"
          fontFamily={"Poppins_700Bold"}
          fontSize={"xl"}
        >
          Avialable Services
        </Text>
        <ScrollView>
          <VStack mx="auto" w="100%" h="100%" space="5" my="10">
            {services.map((service, i) => {
              return (
                <VStack bg="#12202E" mx="5%" key={i} w="90%" h="48">
                  <HStack my="auto" ml="4">
                    <Image
                      src={service.image}
                      alt="image"
                      h="40"
                      w="40"
                      rounded={"md"}
                    />
                    <VStack mx="auto">
                      <Text color="white" mx="auto">
                        {service.nameOfService}
                      </Text>
                      <Text color="white" mx="auto">
                        {service.price}
                      </Text>
                      <Text color="white" mx="auto">
                        {service.description}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible(true);
                          setModalService(service);
                        }}
                      >
                        <VStack
                          mx="auto"
                          mt="4"
                          w="100"
                          bgColor={"#060D16"}
                          rounded={"lg"}
                          h="10"
                        >
                          <Text mx="auto" my="auto" color="white">
                            Order
                          </Text>
                        </VStack>
                      </TouchableOpacity>
                    </VStack>
                  </HStack>
                </VStack>
              );
            })}
          </VStack>
        </ScrollView>
      </SafeAreaView>
      <OrderModel
        isOpen={modalVisible}
        setOpen={setModalVisible}
        modelService={modalService}
      />
    </VStack>
  );
}

const OrderModel = ({ isOpen, setOpen, modelService }: any) => {
  const [numberOfItems, setNumberOfItems] = useState(1);

  async function orderService() {
    let email = await getValueFor("email");
    //replace . with _ in email
    email = email.replace(".", "_");
    const sellerMail = modelService.email.replace(".", "_");
    const userRef = ref(db, "users/" + email + "/orders");
    const sellerRef = ref(db, "users/" + sellerMail + "/orders");
    const order = {
      nameOfService: modelService.nameOfService,
      price: modelService.price,
      description: modelService.description,
      image: modelService.image,
      numberOfItems: numberOfItems,
      total: numberOfItems * modelService.price,
      sellerEmail: sellerMail,
      buyerEmail: email,
      status: "Pending",
    };
    await push(userRef, order);
    await push(sellerRef, order);
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      size="full"
      safeArea={0}
      closeOnOverlayClick={false}
      mt="-9"
    >
      <Modal.Content>
        <VStack bgColor={"#09151E"} w="100%" h="100%">
          <SafeAreaView>
            <VStack mx="2">
              <TouchableOpacity onPress={() => setOpen(false)}>
                <FontAwesome name="angle-left" size={34} color="white" />
              </TouchableOpacity>

              <VStack mt="4" rounded="lg" bg="#12202E">
                <HStack mx="auto" space="24">
                  <Image
                    src={modelService.image}
                    rounded={"lg"}
                    alt="image"
                    m="2"
                    h="40"
                    w="40"
                  />
                  <VStack mx="auto" ml="-10" my="auto">
                    <Text color="white">{modelService.nameOfService}</Text>
                    <Text color="white">{modelService.price}</Text>
                    <Text color="white">{modelService.description}</Text>
                    <HStack ml="-10" mt="2">
                      <TouchableOpacity
                        onPress={() => {
                          if (numberOfItems > 1) {
                            setNumberOfItems(numberOfItems - 1);
                          }
                        }}
                      >
                        <Stack
                          my="auto"
                          bg="#1D3647"
                          px="2"
                          p="1"
                          rounded={"lg"}
                        >
                          <FontAwesome name="minus" size={24} color="white" />
                        </Stack>
                      </TouchableOpacity>
                      <Text color="white" fontSize={"2xl"} mx="auto" my="auto">
                        {numberOfItems}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setNumberOfItems(numberOfItems + 1);
                        }}
                      >
                        <Stack
                          my="auto"
                          bg="#1D3647"
                          px="2"
                          p="1"
                          rounded={"lg"}
                        >
                          <FontAwesome name="plus" size={24} color="white" />
                        </Stack>
                      </TouchableOpacity>
                    </HStack>
                  </VStack>
                </HStack>
              </VStack>
              <VStack mx="auto" mt="4" w="100%" rounded={"lg"}>
                <Text color={"white"}>Item Summary</Text>
                <VStack
                  mx="auto"
                  mt="4"
                  w="100%"
                  rounded={"lg"}
                  bg="#12202E"
                  h="40"
                  p="4"
                >
                  <HStack w="100%" justifyContent={"space-between"}>
                    <Text color="white">Item Name</Text>
                    <Text color="white">{modelService.nameOfService}</Text>
                  </HStack>

                  <HStack w="100%" justifyContent={"space-between"}>
                    <Text color="white">Item Price</Text>
                    <Text color="white">{modelService.price}</Text>
                  </HStack>

                  <HStack w="100%" justifyContent={"space-between"}>
                    <Text color="white">Item Quantity</Text>
                    <Text color="white">{numberOfItems}</Text>
                  </HStack>
                  <HStack mt="4" w="100%" justifyContent={"space-between"}>
                    <Text color="white">Total</Text>
                    <Text color="white">
                      {modelService.price * numberOfItems}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
              <TouchableOpacity
                onPress={() => {
                  orderService();
                  setOpen(false);
                }}
              >
                <VStack
                  mx="auto"
                  mt="4"
                  w="100%"
                  bg="#4030FB"
                  py="4"
                  rounded={"lg"}
                >
                  <Text color={"white"} mx="auto">
                    Order
                  </Text>
                </VStack>
              </TouchableOpacity>
            </VStack>
          </SafeAreaView>
        </VStack>
      </Modal.Content>
    </Modal>
  );
};
