import React, { useEffect, useState } from "react";
import { VStack, HStack, Text, Stack, ZStack, ScrollView } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import db from "../firebase";
import { get, onValue, ref, update } from "firebase/database";
import { getValueFor } from "../utils/Storage";
import { Touchable, TouchableOpacity } from "react-native";

const OrderScreen = () => {
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [email, setEmail] = useState<string>("");
  async function getMyordersFromDb() {
    let email = await getValueFor("email");
    //replace . with _ in email
    email = email.replace(".", "_");
    setEmail(email);
    const userOrdersRef = ref(db, "users/" + email + "/orders");
    onValue(userOrdersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let myOrders: any[] = [];
        for (let key in data) {
          let order = data[key];
          order.id = key;
          myOrders.push(order);
        }
        setMyOrders(myOrders);
        console.log(myOrders);
      }
    });
  }

  useEffect(() => {
    getMyordersFromDb();
  }, []);
  return (
    <VStack bg="#09151E" w="100%" h="100%">
      <SafeAreaView>
        <ScrollView>
          {myOrders.map((order, i) => {
            return (
              <Stack key={i}>
                {order.sellerEmail === email && (
                  <SellerOrdersScreen order={order} />
                )}
                {order.buyerEmail === email && (
                  <BuyerOrdersScreen order={order} />
                )}
              </Stack>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </VStack>
  );
};

export default OrderScreen;

const SellerOrdersScreen = ({ order }: any) => {
  const status = order.status;
  const states = [
    "Pending",
    "Approved",
    "Processing",
    "Completed",
    "EscrowCompleted",
  ];

  async function updateOrderStatus(orderId: string, status: string) {
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
      console.log(approve);
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
      console.log(process);
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
      console.log(complete);
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
  }
  return (
    <VStack>
      <VStack mx="4">
        {states.map((s: any, i: any) => {
          return (
            <Stack key={i}>
              <HStack>
                {states.indexOf(status) >= states.indexOf(s) ? (
                  <CircleComponent state={false} />
                ) : (
                  <CircleComponent state={true} />
                )}

                <Text mx="10" color="white">
                  {s}
                </Text>
                {status === s && (
                  <TouchableOpacity
                    onPress={() => {
                      if (s === "Pending") {
                        updateOrderStatus(order.orderId, "Approved");
                      }
                      if (s === "Approved") {
                        updateOrderStatus(order.orderId, "Processing");
                      }
                      if (s === "Processing") {
                        updateOrderStatus(order.orderId, "Completed");
                      }
                    }}
                  >
                    <Text color="white">
                      {s === "Pending" && "Approve"}
                      {s === "Approved" && "Start Processing"}
                      {s === "Processing" && "Complete"}
                    </Text>
                  </TouchableOpacity>
                )}
              </HStack>
              {i !== states.length - 1 && (
                <LineComponent status={status} state={s} />
              )}
            </Stack>
          );
        })}
      </VStack>
    </VStack>
  );
};

const LineComponent = ({ status, state }: any) => {
  const states = [
    "Pending",
    "Approved",
    "Processing",
    "Completed",
    "EscrowCompleted",
  ];
  //if status is before state then return green line else return grey dahsed line
  return (
    <VStack space="2" h="10" mx="2.5">
      {states.indexOf(status) > states.indexOf(state) ? (
        <Stack bg="#347D1B" w="0.5" h="10"></Stack>
      ) : (
        <>
          {Array(5)
            .fill(0)
            .map((_, i) => {
              return <Stack key={i} bg="#1D4A70" w="0.5" h="2"></Stack>;
            })}
        </>
      )}
    </VStack>
  );
};

const CircleComponent = ({ status, state }: any) => {
  return (
    <ZStack>
      <Stack
        bg={state ? "#09151E" : "#8EF140"}
        rounded={"full"}
        w="5"
        h="5"
        borderColor={state ? "#347D1B" : "#1D4A70"}
        borderWidth="2"
      ></Stack>
    </ZStack>
  );
};

const BuyerOrdersScreen = ({ order }: any) => {
  async function updateOrderStatus(orderId: string, status: string) {
    const process = await fetch("http://157.230.188.72:8080/complete_escrow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderid: orderId,
      }),
    });
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
  }
  return (
    <VStack>
      <Text color="white">{order.nameOfService}</Text>
      <Text color="white">{order.price}</Text>
      <Text color="white">{order.status}</Text>
      {order.status === "Completed" && (
        <TouchableOpacity
          onPress={() => {
            updateOrderStatus(order.orderId, "EscrowCompleted");
          }}
        >
          <Text color="white">Complete Escrow</Text>
        </TouchableOpacity>
      )}
    </VStack>
  );
};
