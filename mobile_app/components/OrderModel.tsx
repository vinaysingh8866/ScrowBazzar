import { FontAwesome } from "@expo/vector-icons";
import { get, push, ref, update } from "firebase/database";
import { HStack, Image, Modal, Stack, Text, VStack } from "native-base";
import { useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import db from "../firebase";
import { uuidv4 } from "../pages/ProfileScreen";
import { getValueFor } from "../utils/Storage";

const OrderModel = ({ isOpen, setOpen, modelService }: any) => {
  const [numberOfItems, setNumberOfItems] = useState(1);

  async function orderService() {
    const id = (await uuidv4()).toString();
    let email = await getValueFor("email");
    email = email.replace(".", "_");
    const sellerMail = modelService.email.replace(".", "_");
    const userRef = ref(db, "users/" + email + "/orders");
    const sellerRef = ref(db, "users/" + sellerMail + "/orders");
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
    const buyerRef = ref(db, "users/" + email + "/info");
    const buyerInfo = await get(buyerRef);
    const buyerBalance = buyerInfo.val().balance;
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

export default OrderModel;