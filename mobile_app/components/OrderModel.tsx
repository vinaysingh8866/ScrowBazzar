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
import { SetStateAction, useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import db from "../firebase";
import { uuidv4 } from "../pages/ProfileScreen";
import { getValueFor } from "../utils/Storage";
import AppButton from "./AppButton";
import AppInput from "./AppInput";
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
  const [partnerParty, setPartnerParty] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [share, setShare] = useState("0");
  const [approvalAmount, setApprovalAmount] = useState("0");
  const [processAmount, setProcessAmount] = useState("0");
  const [deliveryAmount, setDeliveryAmount] = useState("0");
  async function createCustomEscrow() {
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

    const dataRes = await fetch(
      "http://157.230.188.72:8080/create_custom_escrow_order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderid: id,
          amount: numberOfItems * modelService.price,
          seller: sellerMail,
          buyers: "userA,userB",
          shares: "500,500",
          customTransfer: "100,0,0,900",
        }),
      }
    );
    //console.log(dataRes);
  }

  async function customTransfer() {
    const id = (await uuidv4()).toString();
    let email = await getValueFor("email");
    let partyEmail = partnerParty.replace(".", "_");
    email = email.replace(".", "_");
    const buyerRef = ref(db, "users/" + email + "/info");
    const buyerInfo = await get(buyerRef);
    const buyerBalance = buyerInfo.val().balance;
    const sellerMail = modelService.email.replace(".", "_");
    const userRef = ref(db, "users/" + email + "/orders");
    const sellerRef = ref(db, "users/" + sellerMail + "/orders");
    const partyRef = ref(db, "users/" + partyEmail + "/orders");
    if (buyerBalance < numberOfItems * modelService.price) {
      alert("Insufficient Balance");
      return;
    }
    const order = {
      orderId: id,
      nameOfService: modelService.nameOfService,
      price: modelService.price,
      description: modelService.description,
      image: modelService.image,
      numberOfItems: numberOfItems,
      total: numberOfItems * modelService.price,
      sellerEmail: sellerMail,
      buyersEmail: [email, partyEmail],
      shares: [numberOfItems * modelService.price - parseInt(share), share],
      status: "Awaiting Agreement",
      customTransfer: [
        approvalAmount,
        processAmount,
        deliveryAmount,
        numberOfItems * modelService.price -
          (parseInt(approvalAmount) +
            parseInt(processAmount) +
            parseInt(deliveryAmount)),
      ],
      customEscrow: true,
    };

    await push(userRef, order);
    await push(sellerRef, order);
    await push(partyRef, order);
  }

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
    //console.log(dataRes);

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
              isCustom ? customTransfer() : orderService();
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
                {!isCustom && (
                  <VStack mx="auto" w="100%" rounded={"lg"}>
                    <AppButton onPress={() => setIsCustom(true)}>
                      <Text color="white">Add Parties</Text>
                    </AppButton>
                  </VStack>
                )}
                {isCustom && (
                  <VStack mx="auto" w="100%" rounded={"lg"}>
                    <VStack
                      mx="auto"
                      mt="4"
                      w="100%"
                      rounded={"lg"}
                      bg="#12202E"
                      p="4"
                    >
                      <Stack w="100%" h="12">
                        <AppInput
                          placeholder="Enter Party Email"
                          onChangeText={(text: SetStateAction<string>) =>
                            setPartnerParty(text.toString().toLocaleLowerCase())
                          }
                          width={"100%"}
                          keyboardType={undefined}
                          maxLength={1000}
                          value={partnerParty}
                          isFocused={false}
                          secondary={false}
                        />
                      </Stack>
                      <HStack w="100%" h="12">
                        <Text color="white" my="auto">
                          Share
                        </Text>
                        <AppInput
                          placeholder="Enter Share Percentage"
                          onChangeText={(text: SetStateAction<string>) =>
                            setShare(text)
                          }
                          width={"70%"}
                          keyboardType={undefined}
                          maxLength={1000}
                          value={share}
                          isFocused={false}
                          secondary={false}
                        />
                      </HStack>
                      <HStack w="100%" h="12">
                        <Text color="white" my="auto">
                          Approval
                        </Text>
                        <AppInput
                          placeholder="Amount to Send On Approval"
                          onChangeText={(text: SetStateAction<string>) =>
                            setApprovalAmount(text)
                          }
                          width={"70%"}
                          keyboardType={undefined}
                          maxLength={1000}
                          value={approvalAmount}
                          isFocused={false}
                          secondary={false}
                        />
                      </HStack>
                      <HStack w="100%" h="12">
                        <Text color="white" my="auto">
                          Processed
                        </Text>
                        <AppInput
                          placeholder="Amount to Send On Processing"
                          onChangeText={(text: SetStateAction<string>) =>
                            setProcessAmount(text)
                          }
                          width={"70%"}
                          keyboardType={undefined}
                          maxLength={1000}
                          value={processAmount}
                          isFocused={false}
                          secondary={false}
                        />
                      </HStack>
                      <HStack w="100%" h="12">
                        <Text color="white" my="auto">
                          Delivery
                        </Text>
                        <AppInput
                          placeholder="Amount to Send On Processing"
                          onChangeText={(text: SetStateAction<string>) =>
                            setDeliveryAmount(text)
                          }
                          width={"70%"}
                          keyboardType={undefined}
                          maxLength={1000}
                          value={deliveryAmount}
                          isFocused={false}
                          secondary={false}
                        />
                      </HStack>
                    </VStack>
                  </VStack>
                )}
              </VStack>
            </ScrollView>
          </SafeAreaView>
        </VStack>
      </Modal.Content>
    </Modal>
  );
};

export default OrderModel;
