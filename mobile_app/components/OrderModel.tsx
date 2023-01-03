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
  Slider,
  Stack,
  Text,
  VStack,
} from "native-base";
import { background } from "native-base/lib/typescript/theme/styled-system";
import { SetStateAction, useEffect, useState } from "react";
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

const AppSlider = ({
  title,
  subtitle,
  endValue = 100,
  slidervalue,
  setSliderValue,
  startValue = 50,
  total,
}: {
  title: string;
  subtitle: string;
  endValue: number;
  slidervalue: any;
  setSliderValue: any;
  startValue: number;
  total: any;
}) => {
  const [v, setV] = useState(startValue);

  useEffect(() => {
    setSliderValue(Math.floor((v / 100) * total).toString());
  }, [total, v]);
  return (
    <>
      <VStack w="100%" h="80px" mx="auto">
        <HStack my="auto">
          <AppSubtitle>{title}</AppSubtitle>
          {subtitle && (
            <Text color={"#D9F1FF"} fontSize={"12px"} pt="1.5">
              {subtitle}
            </Text>
          )}
        </HStack>
        <HStack
          w="90%"
          h="30px"
          rounded={"full"}
          bg={total.toString() != slidervalue ? "#193F60" : "#D9F1FF"}
          justifyContent={"flex-start"}
          alignSelf="center"
          my="auto"
          mt="-2"
        >
          <Slider
            defaultValue={startValue}
            maxValue={endValue}
            w="90%"
            step={10}
            sliderTrackHeight={30}
            onChange={(v) => setV(v)}
          >
            <Slider.Track rounded={"full"} bg="#193F60">
              <Slider.FilledTrack bg="#D9F1FF" />
            </Slider.Track>
            <Slider.Thumb bg="#D9F1FF">
              <HStack w="50px" h="35px" px="1" pt="10px" zIndex={10}>
                <Text
                  w="100%"
                  h={"100%"}
                  textAlign={"center"}
                  fontSize="11.5px"
                  fontWeight={"black"}
                >
                  ₹{slidervalue}
                </Text>
              </HStack>
            </Slider.Thumb>
          </Slider>
          {total.toString() != slidervalue && (
            <VStack
              w="50px"
              h="30px"
              justifyContent={"space-around"}
              ml="-25px"
            >
              <Text
                alignSelf="center"
                textAlign={"center"}
                fontSize="11.5px"
                fontWeight={"black"}
                color="#D9F1FF"
              >
                ₹{total}
              </Text>
            </VStack>
          )}
        </HStack>
      </VStack>
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
  // const [maxApprove, setMaxApprove] = useState(100);
  // const [maxProcess, setMaxProcess] = useState(100);
  // const [maxDelivery, setMaxDelivery] = useState(100);
  const [approvalAmount, setApprovalAmount] = useState("0");
  const [processAmount, setProcessAmount] = useState("0");
  const [deliveryAmount, setDeliveryAmount] = useState("0");

  // useEffect(() => {
  //   setMaxApprove(
  //     Math.round(
  //       (modelService.price * numberOfItems -
  //         (parseInt(deliveryAmount) + parseInt(processAmount))) /
  //         (modelService.price * numberOfItems)
  //     ) * 100
  //   );
  //   setMaxProcess(
  //     Math.round(
  //       (modelService.price * numberOfItems -
  //         (parseInt(deliveryAmount) + parseInt(approvalAmount))) /
  //         (modelService.price * numberOfItems)
  //     ) * 100
  //   );
  //   setMaxDelivery(
  //     Math.round(
  //       (modelService.price * numberOfItems -
  //         (parseInt(approvalAmount) + parseInt(processAmount))) /
  //         (modelService.price * numberOfItems)
  //     ) * 100
  //   );
  //   console.log(maxApprove, maxProcess, maxDelivery);
  // }, [approvalAmount, processAmount, deliveryAmount]);
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
    const [share, setShare] = useState("599");
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
            <ScrollView h="100%" pt="2">
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
                  <HStack mx="auto" w="100%" rounded={"lg"} h="50px">
                    <AppButton
                      onPress={() => setIsCustom(true)}
                      width={"100%"}
                      secondary={false}
                    >
                      <Text color="white">Add Partner</Text>
                    </AppButton>
                  </HStack>
                )}
                {isCustom && (
                  <VStack mx="auto" w="100%" rounded={"lg"}>
                    <VStack
                      mx="auto"
                      w="100%"
                      rounded={"lg"}
                      bg="#12202E"
                      px={4}
                      py={2}
                    >
                      <HStack
                        w="100%"
                        h="40px"
                        mx="auto"
                        my="2"
                        justifyContent={"space-between"}
                      >
                        <Stack w="80%" my="auto">
                          <Text
                            fontSize={"18px"}
                            fontWeight="bold"
                            color={"#fff"}
                          >
                            Second Partner
                          </Text>
                        </Stack>
                        <Stack alignSelf={"flex-end"}>
                          <AppButton
                            onPress={() => setIsCustom(false)}
                            secondary={false}
                            width={"40px"}
                          >
                            <FontAwesome name="close" size={20} color="white" />
                          </AppButton>
                        </Stack>
                      </HStack>
                      <VStack w="100%" h="70px" mx="auto" my="2" mt="4">
                        <Stack my="auto">
                          <AppSubtitle>Email</AppSubtitle>
                        </Stack>
                        <HStack w="100%" h="40px" mx="auto" my="2">
                          <AppInput
                            placeholder="Enter Party Email"
                            onChangeText={(text: SetStateAction<string>) =>
                              setPartnerParty(
                                text.toString().toLocaleLowerCase()
                              )
                            }
                            width={"100%"}
                            keyboardType={undefined}
                            maxLength={1000}
                            value={partnerParty}
                            isFocused={false}
                            secondary={true}
                          />
                        </HStack>
                      </VStack>
                      <AppSlider
                        title="Split"
                        endValue={100}
                        slidervalue={share}
                        setSliderValue={setShare}
                        startValue={50}
                        total={modelService.price * numberOfItems}
                      ></AppSlider>
                      <HStack
                        w="100%"
                        h="40px"
                        mx="auto"
                        my="2"
                        justifyContent={"space-between"}
                      >
                        <VStack w="25%" h="40px" justifyContent={"flex-start"}>
                          <Text
                            color={"#D9F1FF"}
                            textAlign="center"
                            fontWeight={"bold"}
                          >
                            ₹{share}
                          </Text>
                          <Text color={"#D9F1FF"} textAlign="center">
                            Your Share
                          </Text>
                        </VStack>
                        <VStack w="25%" h="40px" justifyContent={"center"}>
                          <Text
                            color={"#D9F1FF"}
                            textAlign="center"
                            fontWeight={"bold"}
                            fontSize={"18px"}
                          >
                            {Math.round(
                              (parseInt(share) /
                                (modelService.price * numberOfItems)) *
                                100
                            )}
                            %
                          </Text>
                        </VStack>
                        <VStack w="25%" h="40px" justifyContent={"flex-end"}>
                          <Text
                            color={"#D9F1FF"}
                            textAlign="center"
                            fontWeight={"bold"}
                          >
                            ₹
                            {modelService.price * numberOfItems -
                              parseInt(share)}
                          </Text>
                          <Text color={"#D9F1FF"} textAlign="center">
                            Partner Share
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                    <VStack
                      mx="auto"
                      mt="4"
                      w="100%"
                      rounded={"lg"}
                      bg="#12202E"
                      px={4}
                      py={2}
                    >
                      <Stack w="80%" my="auto">
                        <Text
                          fontSize={"18px"}
                          fontWeight="bold"
                          color={"#fff"}
                        >
                          Tranfers
                        </Text>
                      </Stack>
                      <AppSlider
                        title="Approval"
                        subtitle="(amount released on order approval)"
                        endValue={100}
                        slidervalue={approvalAmount}
                        setSliderValue={setApprovalAmount}
                        startValue={10}
                        total={Math.round(modelService.price * numberOfItems)}
                      ></AppSlider>
                      <AppSlider
                        title="Processed"
                        subtitle="(amount released on order processing)"
                        endValue={100}
                        slidervalue={processAmount}
                        setSliderValue={setProcessAmount}
                        startValue={10}
                        total={Math.round(modelService.price * numberOfItems)}
                      ></AppSlider>
                      <AppSlider
                        title="Delivery"
                        subtitle="(amount released on order delivery)"
                        endValue={100}
                        slidervalue={deliveryAmount}
                        setSliderValue={setDeliveryAmount}
                        startValue={10}
                        total={Math.round(modelService.price * numberOfItems)}
                      ></AppSlider>
                      <HStack
                        w="100%"
                        h="40px"
                        mx="auto"
                        my="2"
                        justifyContent={"space-between"}
                        mt="4"
                      >
                        <VStack w="25%" h="40px" justifyContent={"flex-start"}>
                          <Text
                            color={"#D9F1FF"}
                            textAlign="center"
                            fontWeight={"bold"}
                          >
                            ₹{approvalAmount}
                          </Text>
                          <Text color={"#D9F1FF"} textAlign="center">
                            On Approval
                          </Text>
                        </VStack>
                        <VStack w="25%" h="40px" justifyContent={"flex-end"}>
                          <Text
                            color={"#D9F1FF"}
                            textAlign="center"
                            fontWeight={"bold"}
                          >
                            ₹{processAmount}
                          </Text>
                          <Text color={"#D9F1FF"} textAlign="center">
                            On Processed
                          </Text>
                        </VStack>
                        <VStack w="25%" h="40px" justifyContent={"flex-end"}>
                          <Text
                            color={"#D9F1FF"}
                            textAlign="center"
                            fontWeight={"bold"}
                          >
                            ₹{deliveryAmount}
                          </Text>
                          <Text color={"#D9F1FF"} textAlign="center">
                            On Delivery
                          </Text>
                        </VStack>
                      </HStack>
                      {/* <HStack w="100%" h="40px" mx="auto" my="2">
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
                          secondary={true}
                        />
                      </HStack> */}
                      {/* <HStack w="100%" h="40px" mx="auto" my="2">
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
                          secondary={true}
                        />
                      </HStack> */}
                      {/* <HStack w="100%" h="40px" mx="auto" my="2">
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
                          secondary={true}
                        />
                      </HStack> */}
                    </VStack>
                  </VStack>
                )}
                <VStack mx="auto" w="100%" h="150px"></VStack>
              </VStack>
            </ScrollView>
          </SafeAreaView>
        </VStack>
      </Modal.Content>
    </Modal>
  );
};

export default OrderModel;
