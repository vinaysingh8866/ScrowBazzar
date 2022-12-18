import db from "../firebase";
import { onValue, ref } from "firebase/database";
import AppInput from "../components/AppInput";
import { useEffect, useState } from "react";
import {
  Button,
  HStack,
  IconButton,
  Image,
  ScrollView,
  Stack,
  Text,
  VStack,
} from "native-base";
import { SafeAreaView, TouchableOpacity } from "react-native";
import OrderModel from "../components/OrderModel";
import AppButton from "../components/AppButton";
import AppTitleBar from "../components/AppTitleBar";
import ServiceListComponent from "../components/ServiceListComponent";
import { FontAwesome } from "@expo/vector-icons";

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
        <AppTitleBar title="Marketplace"></AppTitleBar>
        <VStack mx="auto" w="100%" h="100%" space="4" px="4">
          <HStack w="100%" h="40px" mx="auto" my="2" rounded="lg">
            <AppInput
              placeholder="Search"
              value={searchValue}
              onChangeText={setSearchValue}
              width={"100%"}
              keyboardType={"default"}
              maxLength={100}
              isFocused={false}
            />
          </HStack>
          <ScrollView>
            {services.map((service, i) => {
              if (service.nameOfService.includes(searchValue)) {
                return (
                  <ServiceListComponent
                    image={service.image}
                    name={service.nameOfService}
                    category={service.description}
                    price={service.price}
                    key={i}
                  >
                    <AppButton
                      onPress={() => {
                        setModalVisible(true);
                        setModalService(service);
                      }}
                      secondary={true}
                    >
                      Order
                    </AppButton>
                  </ServiceListComponent>
                );
              }
            })}
          </ScrollView>
        </VStack>
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
