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
import AppButton from "../../components/AppButton";
import { FontAwesome } from "@expo/vector-icons";
import CircleComponent from "../../components/Order/CircleComponent";
import LineComponent from "../../components/Order/LineComponent";
const SellerOrdersScreen = ({ order }: any) => {
  const status = order.status;
  const states = [
    "Pending",
    "Approved",
    "Processing",
    "Completed",
    "EscrowCompleted",
  ];
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  async function updateOrderStatus(orderId: string, status: string) {
    setLoading(true);
    if (status === "Pending") {
      const approve = await fetch("http://157.230.188.72:8080/approve_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderid: orderId,
        }),
      });
      //console.log(approve);
    }
    if (status === "Approved") {
      const process = await fetch("http://157.230.188.72:8080/process_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderid: orderId,
        }),
      });
      //console.log(process);
    }
    if (status === "Processing") {
      const complete = await fetch(
        "http://157.230.188.72:8080/complete_order",
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
      //console.log(complete);
    }
    const buyerEmail = order.buyerEmail.replace(".", "_");
    const buyerOrdersRef = ref(db, "users/" + buyerEmail + "/orders");
    const buyerOrders = await get(buyerOrdersRef);
    const buyerOrdersData = buyerOrders.val();
    for (let key in buyerOrdersData) {
      if (buyerOrdersData[key].orderId === orderId) {
        update(ref(db, "users/" + buyerEmail + "/orders/" + key), {
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
    setLoading(false);
  }
  return (
    <VStack bg="#09151E">
      <HStack w="100%" h="200px" rounded="2xl" mt="4">
        <VStack
          w="50%"
          bgColor="#1A3147"
          overflow={"hidden"}
          rounded={"2xl"}
          roundedRight="none"
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
            <HStack w="100%" h="50px">
              {loading ? (
                <Spinner size="lg" mx="auto" color="#D9F1FF" />
              ) : order.status !== "EscrowCompleted" &&
                order.status !== "Completed" ? (
                <AppButton
                  onPress={() => {
                    if (order.status === "Pending") {
                      updateOrderStatus(order.orderId, "Approved");
                    }
                    if (order.status === "Approved") {
                      updateOrderStatus(order.orderId, "Processing");
                    }
                    if (order.status === "Processing") {
                      updateOrderStatus(order.orderId, "Completed");
                    }
                  }}
                  width={"100%"}
                  secondary={false}
                >
                  <Text color="white">
                    {order.status === "Pending" && "Approve"}
                    {order.status === "Approved" && "Start Processing"}
                    {order.status === "Processing" && "Complete"}
                  </Text>
                </AppButton>
              ) : (
                <Text
                  color={
                    order.status === "EscrowCompleted" ? "#E4FF41" : "amber.600"
                  }
                  fontFamily={"Poppins_800Regular"}
                  mx="auto"
                  alignSelf={"center"}
                  fontSize={order.status === "EscrowCompleted" ? "2xl" : "lg"}
                  fontWeight="bold"
                >
                  {order.status === "EscrowCompleted"
                    ? "Finished"
                    : "Escrow Pending"}
                </Text>
              )}
            </HStack>
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
        <Stack
          w="50%"
          bg="#1A3147"
          alignSelf={"flex-end"}
          roundedBottom="2xl"
          py="4"
        >
          {states.map((s: any, i: any) => {
            return (
              <Stack key={i} mx="4">
                <HStack>
                  {states.indexOf(status) >= states.indexOf(s) ? (
                    <CircleComponent state={false} />
                  ) : (
                    <CircleComponent state={true} />
                  )}

                  <Text mx="8" color="white" fontSize="14">
                    {s === "EscrowCompleted" ? "Transfer Done" : s}
                  </Text>
                </HStack>
                {i !== states.length - 1 && (
                  <LineComponent status={status} state={s} />
                )}
              </Stack>
            );
          })}
        </Stack>
      )}
    </VStack>
  );
};

export default SellerOrdersScreen;
