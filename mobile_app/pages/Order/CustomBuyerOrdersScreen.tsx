import React, { useEffect, useState } from "react";
import {
  VStack,
  HStack,
  Text,
  Stack,
  Image,
  Button,
  Spinner,
} from "native-base";
import db from "../../firebase";
import { get, onValue, ref, update } from "firebase/database";
import { getValueFor } from "../../utils/Storage";
import AppButton from "../../components/AppButton";
import { FontAwesome } from "@expo/vector-icons";

const CustomBuyerOrdersScreen = ({ order }: any) => {
  const [loading, setLoading] = useState(false);
  const [isAgreer, setIsAgreer] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  async function agreeOrder() {
    setLoading(true);

    let buyersVal = order.buyersEmail;
    const textBuyers = buyersVal.join(",");
    const shares = order.shares;
    const sharesText = shares.join(",");
    const customEs = order.customTransfer;
    const customEsText = customEs.join(",");
    const process = await fetch(
      "http://157.230.188.72:8080/create_custom_escrow_order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderid: order.orderId,
          seller: order.sellerEmail,
          amount: order.total,
          buyers: textBuyers,
          shares: sharesText,
          customTransfer: customEsText,
        }),
      }
    );
    console.log(sharesText, customEsText);
    console.log(process);
    const buyer1 = buyersVal[0].replace(".", "_");
    const buyer2 = buyersVal[1].replace(".", "_");
    const sellerEmail = order.sellerEmail.replace(".", "_");
    const buyer1OrdersRef = ref(db, "users/" + buyer1 + "/orders");
    const buyer2OrdersRef = ref(db, "users/" + buyer2 + "/orders");
    const sellerOrdersRef = ref(db, "users/" + sellerEmail + "/orders");
    const buyer1Orders = await get(buyer1OrdersRef);
    const buyer2Orders = await get(buyer2OrdersRef);
    const sellerOrders = await get(sellerOrdersRef);
    const buyer1OrdersData = buyer1Orders.val();
    const buyer2OrdersData = buyer2Orders.val();
    const sellerOrdersData = sellerOrders.val();
    for (let key in buyer1OrdersData) {
      if (buyer1OrdersData[key].orderId === order.orderId) {
        update(ref(db, "users/" + buyer1 + "/orders/" + key), {
          status: "Pending",
        });
      }
    }
    for (let key in buyer2OrdersData) {
      if (buyer2OrdersData[key].orderId === order.orderId) {
        update(ref(db, "users/" + buyer2 + "/orders/" + key), {
          status: "Pending",
        });
      }
    }
    for (let key in sellerOrdersData) {
      if (sellerOrdersData[key].orderId === order.orderId) {
        update(ref(db, "users/" + sellerEmail + "/orders/" + key), {
          status: "Pending",
        });
      }
    }
    //change balance of buyers
    const buyer1BalanceRef = ref(db, "users/" + buyer1 + "/info/balance");
    const buyer2BalanceRef = ref(db, "users/" + buyer2 + "/info/balance");
    const buyer1Balance = await get(buyer1BalanceRef);
    const buyer2Balance = await get(buyer2BalanceRef);
    const buyer1BalanceData = buyer1Balance.val();
    const buyer2BalanceData = buyer2Balance.val();
    const buyer1NewBalance = buyer1BalanceData - order.shares[0];
    const buyer2NewBalance = buyer2BalanceData - order.shares[1];
    update(ref(db, "users/" + buyer1 + "/info"), {
      balance: buyer1NewBalance,
    });
    update(ref(db, "users/" + buyer2 + "/info"), {
      balance: buyer2NewBalance,
    });

    setLoading(false);
  }

  useEffect(() => {}, [loading, isAgreer, order]);
  async function updateOrderStatus(orderId: string, status: string) {
    setLoading(true);
    const process = await fetch(
      "http://157.230.188.72:8080/accept_order_delivery",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderid: orderId,
        }),
      }
    );
    //(process)
    //set buyers status
    let buyersVal = order.buyersEmail;
    const buyer1 = buyersVal[0].replace(".", "_");
    const buyer2 = buyersVal[1].replace(".", "_");
    const buyer1OrdersRef = ref(db, "users/" + buyer1 + "/orders");
    const buyer2OrdersRef = ref(db, "users/" + buyer2 + "/orders");
    const buyer1Orders = await get(buyer1OrdersRef);
    const buyer2Orders = await get(buyer2OrdersRef);
    const buyer1OrdersData = buyer1Orders.val();
    const buyer2OrdersData = buyer2Orders.val();
    for (let key in buyer1OrdersData) {
      if (buyer1OrdersData[key].orderId === orderId) {
        update(ref(db, "users/" + buyer1 + "/orders/" + key), {
          status: status,
        });
      }
    }
    for (let key in buyer2OrdersData) {
      if (buyer2OrdersData[key].orderId === orderId) {
        update(ref(db, "users/" + buyer2 + "/orders/" + key), {
          status: status,
        });
      }
    }

    const sellerEmail = order.sellerEmail.replace(".", "_");
    const sellerOrdersRef = ref(db, "users/" + sellerEmail + "/orders");
    const sellerOrders = await get(sellerOrdersRef);
    const sellerOrdersData = sellerOrders.val();
    for (let key in sellerOrdersData) {
      if (sellerOrdersData[key].orderId === orderId) {
        update(ref(db, "users/" + sellerEmail + "/orders/" + key), {
          status: status,
        });
      }
    }

    //increase seller balance
    const sellerRef = ref(db, "users/" + sellerEmail + "/info");
    const seller = await get(sellerRef);
    const sellerData = seller.val();
    const sellerBalance = parseInt(sellerData.balance);
    const newSellerBalance = sellerBalance + parseInt(order.customTransfer[3]);
    update(ref(db, "users/" + sellerEmail + "/info"), {
      balance: newSellerBalance,
    });
    setLoading(false);
  }
  useEffect(() => {
    const mail = getValueFor("email");
    const buyers = order.buyersEmail;
    mail.then((value) => {
      //console.log(value, buyers[1]);
      if (buyers[1] == value) {
        setIsAgreer(true);
      }
    });
    //console.log(isAgreer);
  }, []);

  return (
    <>
      <VStack bg="#09151E">
        <HStack w="100%" h="200px" rounded="2xl" mt="4">
          <VStack
            w="50%"
            bgColor="#1A3147"
            overflow={"hidden"}
            rounded={"2xl"}
            roundedRight="none"
            roundedBottomLeft={showDetails ? "none" : "2xl"}
          >
            <Image
              src={order.image}
              alt="image"
              h="200px"
              w="200px"
              rounded={"2xl"}
              roundedRight="none"
            />
          </VStack>
          <VStack w="50%">
            <VStack
              mx="auto"
              w="100%"
              p="4"
              height={"80%"}
              roundedTopRight={"2xl"}
              justifyContent={"space-between"}
              bg="#12202E"
            >
              <VStack w="100%">
                <Text color="white" fontWeight={"black"} fontSize={18}>
                  {order.nameOfService}
                </Text>
                <Text color="#D9F1FF" fontWeight={"400"} fontSize={15}>
                  Quantity: {order.numberOfItems}
                </Text>
                <Text color="white" fontWeight={"bold"}>
                  ₹{order.total}
                </Text>
              </VStack>
              <VStack>
                {order.status === "Completed" ? (
                  loading ? (
                    <Spinner size="lg" mx="auto" color="#D9F1FF" />
                  ) : (
                    <Stack>
                      <AppButton
                        secondary
                        onPress={() => {
                          updateOrderStatus(order.orderId, "EscrowCompleted");
                        }}
                        width={"100%"}
                      >
                        <Text color="white">Complete Escrow</Text>
                      </AppButton>
                    </Stack>
                  )
                ) : (
                  <>
                    {isAgreer && order.status === "Awaiting Agreement" ? (
                      <Stack>
                        <HStack h="50px">
                          <AppButton
                            secondary={false}
                            onPress={() => {
                              agreeOrder();
                            }}
                            width={"100%"}
                          >
                            <Text color="white">Agree</Text>
                          </AppButton>
                        </HStack>
                      </Stack>
                    ) : (
                      <Stack>
                        <Text
                          color={"#E4FF41"}
                          fontFamily={"Poppins_800Regular"}
                          mx="auto"
                          alignSelf={"center"}
                          fontSize={
                            order.status === "EscrowCompleted" ? "2xl" : "2xl"
                          }
                          fontWeight="bold"
                        >
                          {order.status === "EscrowCompleted"
                            ? "Finished"
                            : order.status}
                        </Text>
                      </Stack>
                    )}
                  </>
                )}
              </VStack>
            </VStack>
            <HStack
              w="100%"
              h="20%"
              alignSelf="center"
              bg="#193F60"
              roundedBottomRight={showDetails ? "none" : "2xl"}
            >
              <Button
                w="100%"
                h="100%"
                variant={"ghost"}
                onPress={() => setShowDetails(!showDetails)}
              >
                <FontAwesome
                  name={showDetails ? "chevron-up" : "chevron-down"}
                  size={15}
                  color="#D9F1FF"
                />
              </Button>
            </HStack>
          </VStack>
        </HStack>
        {showDetails && (
          <VStack
            w="100%"
            bg="#12202E"
            alignSelf={"center"}
            roundedBottom="2xl"
            p="2"
          >
            <VStack
              w="100%"
              mx="auto"
              my="2"
              justifyContent={"space-between"}
              mt="4"
            >
              <Text color={"#D9F1FF"} textAlign="center">
                Partner:
              </Text>
              <Text color={"#D9F1FF"} textAlign="center" fontWeight={"bold"}>
                {isAgreer
                  ? order.buyersEmail[1].replace("_", ".")
                  : order.buyersEmail[0].replace("_", ".")}
              </Text>
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
                    ₹{order.shares[1]}
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
                      (parseInt(order.shares[1]) /
                        (parseInt(order.shares[0]) +
                          parseInt(order.shares[1]))) *
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
                    ₹{order.shares[0]}
                  </Text>
                  <Text color={"#D9F1FF"} textAlign="center">
                    Partner Share
                  </Text>
                </VStack>
              </HStack>
            </VStack>
            <VStack
              w="100%"
              mx="auto"
              my="2"
              justifyContent={"space-between"}
              mt="2"
              h="20px"
            >
              <Text color={"#D9F1FF"} textAlign="center">
                Transfers:
              </Text>
            </VStack>
            <HStack
              w="100%"
              h="40px"
              mx="auto"
              my="2"
              justifyContent={"space-between"}
              mt="4"
            >
              <VStack w="25%" h="40px" justifyContent={"flex-start"}>
                <Text color={"#D9F1FF"} textAlign="center" fontWeight={"bold"}>
                  ₹100
                </Text>
                <Text color={"#D9F1FF"} textAlign="center">
                  On Approval
                </Text>
              </VStack>
              <VStack w="25%" h="40px" justifyContent={"flex-end"}>
                <Text color={"#D9F1FF"} textAlign="center" fontWeight={"bold"}>
                  ₹200
                </Text>
                <Text color={"#D9F1FF"} textAlign="center">
                  On Processed
                </Text>
              </VStack>
              <VStack w="25%" h="40px" justifyContent={"flex-end"}>
                <Text color={"#D9F1FF"} textAlign="center" fontWeight={"bold"}>
                  ₹300
                </Text>
                <Text color={"#D9F1FF"} textAlign="center">
                  On Delivery
                </Text>
              </VStack>
            </HStack>
          </VStack>
        )}
      </VStack>
    </>
  );
};

export default CustomBuyerOrdersScreen;