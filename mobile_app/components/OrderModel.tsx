import { FontAwesome } from "@expo/vector-icons";
import { get, push, ref, update } from "firebase/database";
import {
  Button,
  HStack,
  Icon,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Stack,
  Text,
  VStack,
} from "native-base";
import { background } from "native-base/lib/typescript/theme/styled-system";
import { useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import db from "../firebase";
import { uuidv4 } from "../pages/ProfileScreen";
import { getValueFor } from "../utils/Storage";
import AppButton from "./AppButton";
import AppSubtitle from "./AppSubtitile";
import AppTitle from "./AppTitle";
import AppTitleBar from "./AppTitleBar";
import ServiceListComponent from "./ServiceListComponent";

const QuantityButtons = ({
  numberOfItems,
  setNumberOfItems,
}: {
  numberOfItems: any;
  setNumberOfItems: any;
}) => {
  return (
    <>
      <AppButton
        secondary
        width="30%"
        onPress={() => {
          if (numberOfItems > 1) {
            setNumberOfItems(numberOfItems - 1);
          }
        }}
      >
        <FontAwesome name="minus" size={24} color="white" />
      </AppButton>
      <Text
        color="white"
        width="30%"
        textAlign={"center"}
        fontSize={"2xl"}
        my="auto"
      >
        {numberOfItems}
      </Text>
      <AppButton
        secondary
        width="30%"
        onPress={() => {
          setNumberOfItems(numberOfItems + 1);
        }}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </AppButton>
    </>
  );
};

const CompleteOrder = ({
  modelService,
  numberOfItems,
  onPress,
}: {
  modelService: any;
  numberOfItems: any;
  onPress: any;
}) => {
  return (
    <HStack
      w="100%"
      h="70px"
      px="2"
      position={"absolute"}
      bottom="2"
      zIndex="3"
    >
      <Pressable
        bgColor={"#347D1B"}
        w="100%"
        rounded={"lg"}
        flexDirection="row"
        overflow={"hidden"}
        onPress={onPress}
      >
        <Stack w="50%" h="100%" px="3" py="2">
          <HStack height={"50%"} alignItems={"center"}>
            <Text color={"white"} fontWeight="medium">
              Number of items: {numberOfItems}
            </Text>
          </HStack>
          <HStack height={"50%"} alignItems={"center"}>
            <Text color={"white"} fontWeight="black">
              ₹{modelService.price * numberOfItems}
            </Text>
          </HStack>
        </Stack>
        <HStack
          w="50%"
          h="100%"
          p="4"
          alignItems={"center"}
          justifyContent="flex-end"
        >
          <Text color={"white"} fontWeight="bold" pr="2">
            Complete Order
          </Text>
          <FontAwesome name="chevron-right" size={24} color="white" />
        </HStack>
      </Pressable>
    </HStack>
  );
};
const OrderModel = ({ isOpen, setOpen, modelService }: any) => {
  const [numberOfItems, setNumberOfItems] = useState(1);

  async function orderService() {
    const id = (await uuidv4()).toString();
    let email = await getValueFor("email");

    email = email.replace(".", "_");
    const buyerRef = ref(db, "users/" + email + "/info");
    const buyerInfo = await get(buyerRef);
    const buyerBalance = buyerInfo.val().balance;
    const sellerMail = modelService.email.replace(".", "_");
    const userRef = ref(db, "users/" + email + "/orders");
    const sellerRef = ref(db, "users/" + sellerMail + "/orders");
    if (buyerBalance < numberOfItems * modelService.price) {
      alert("Insufficient Balance");
      return;
    }

    const dataRes = await fetch("http://157.230.188.72:8080/create_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderid: id,
        amount: numberOfItems * modelService.price,
        buyer: email,
        seller: sellerMail,
      }),
    });
    console.log(dataRes);

    const order = {
      orderId: id,
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

    // reduce the balance of buyer
    await update(buyerRef, {
      balance: buyerBalance - numberOfItems * modelService.price,
    });
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
        <VStack bgColor={"#09151E"} w="100%" h="100%" pt="4">
          <CompleteOrder
            onPress={() => {
              orderService();
              setOpen(false);
            }}
            numberOfItems={numberOfItems}
            modelService={modelService}
          ></CompleteOrder>
          <SafeAreaView>
            <AppTitleBar
              back
              title={modelService.nameOfService}
              onPress={() => setOpen(false)}
            ></AppTitleBar>
            <ScrollView h="90%" pt="2">
              <VStack mx="auto" w="100%" h="100%" space="4" px="4">
                <VStack rounded="lg">
                  <ServiceListComponent
                    image={modelService.image}
                    name={modelService.nameOfService}
                    category={modelService.description}
                    price={modelService.price}
                  >
                    <QuantityButtons
                      numberOfItems={numberOfItems}
                      setNumberOfItems={setNumberOfItems}
                    ></QuantityButtons>
                  </ServiceListComponent>
                </VStack>
                <VStack mx="auto" w="100%" rounded={"lg"}>
                  <VStack
                    mx="auto"
                    mt="4"
                    w="100%"
                    rounded={"lg"}
                    bg="#12202E"
                    p="4"
                  >
                    <Text color="white">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation{" "}
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt {"\n"}
                      {"\n"}Labore et dolore magna aliqua. Ut enim ad minim
                      veniam, quis nostrud exercitation Lorem ipsum dolor sit
                      amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation{"\n"}
                      {"\n"} Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit, sed do eiusmod tempor incididunt ut labore et dolore
                      magna aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation Lorem ipsum dolor sit amet, consectetur
                      adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua. Ut enim ad minim veniam,
                      quis nostrud exercitation
                    </Text>
                  </VStack>
                </VStack>
              </VStack>
            </ScrollView>
          </SafeAreaView>
        </VStack>
      </Modal.Content>
    </Modal>
  );
};

export default OrderModel;
