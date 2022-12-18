import db from "../firebase";
import { get, onValue, push, ref, update } from "firebase/database";
import { FontAwesome } from "@expo/vector-icons";
import OrderScreen from "./OdersScreen";
import AppInput from "../components/AppInput";
import { useEffect, useState } from "react";
import { HStack, Image, ScrollView, Stack, Text, VStack } from "native-base";
import { SafeAreaView, TouchableOpacity } from "react-native";
import OrderModel from "../components/OrderModel";
function HomeScreen() {
  const [services, setServices] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalService, setModalService] = useState<any>({});
  const [searchValue, setSearchValue] = useState("");
  async function getMarketServices() {
    const services = ref(db, "marketServices/");

    onValue(
      services,
      (snapshot) => {
        let servicesArray: any[] = [];
        snapshot.forEach((childSnapshot) => {
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
          color={modalVisible ? "transparent" : "white"}
          mx="6"
          fontFamily={"Poppins_700Bold"}
          fontSize={"xl"}
        >
          Avialable Services
        </Text>
        <Stack h="10" m="6">
          <AppInput
            placeholder="Search"
            value={searchValue}
            onChangeText={setSearchValue} width={"100%"} keyboardType={"default"} maxLength={100} isFocused={false}          />
        </Stack>
        <ScrollView>
          <VStack mx="auto" w="100%" h="100%" space="5" my="10">
            {services.map((service, i) => {
              if (service.nameOfService.includes(searchValue)) {
                return (
                  <VStack
                    bg="#12202E"
                    mx="5%"
                    key={i}
                    w="90%"
                    h="48"
                    rounded="md"
                  >
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
              }
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

export default HomeScreen;