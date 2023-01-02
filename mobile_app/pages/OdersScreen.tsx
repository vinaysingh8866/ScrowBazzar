import React, { useEffect, useState } from "react";
import {
  VStack,
  HStack,
  Text,
  Stack,
  ZStack,
  ScrollView,
  Image,
  Button,
  Spinner,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import db from "../firebase";
import { get, onValue, ref, update } from "firebase/database";
import { getValueFor } from "../utils/Storage";
import AppTitleBar from "../components/AppTitleBar";
import ServiceListComponent from "../components/ServiceListComponent";
import AppButton from "../components/AppButton";
import AppToggle from "../components/AppToggle";
import { FontAwesome } from "@expo/vector-icons";

const OrderScreen = () => {
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [email, setEmail] = useState<string>("");
  const [toggle, setToggle] = useState(true);
  async function getMyordersFromDb() {
    let email = await getValueFor("email");
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
        //(myOrders);
      }
    });
  }

  useEffect(() => {
    getMyordersFromDb();
  }, []);
  return (
    <VStack bg="#09151E" w="100%" h="100%">
      <SafeAreaView>
        <AppTitleBar
          title="My Orders"
          back={false}
          onPress={undefined}
        ></AppTitleBar>
        <AppToggle
          toggle={toggle}
          setToggle={setToggle}
          option1="Placed"
          option2="Received"
        >
          {toggle ? (
            <ScrollView>
              {myOrders.map((order, i) => {
                return (
                  <Stack key={i}>
                    {order.buyerEmail === email && (
                      <BuyerOrdersScreen order={order} />
                    )}
                    {order.buyersEmail != undefined &&
                      order.buyersEmail.includes(email) && (
                        <CustomBuyerOrdersScreen order={order} />
                      )}
                  </Stack>
                );
              })}
            </ScrollView>
          ) : (
            <ScrollView>
              {myOrders.map((order, i) => {
                return (
                  <Stack key={i}>
                    {order.sellerEmail === email &&
                      order.buyersEmail == undefined && (
                        <SellerOrdersScreen order={order} />
                      )}
                    {order.buyersEmail != undefined && (
                      <CustomSellerOrdersScreen order={order} />
                    )}
                  </Stack>
                );
              })}
            </ScrollView>
          )}
        </AppToggle>
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
      {/* <HStack justifyContent={"space-between"} mx="4">
        <Image source={{ uri: order.image }} alt="image" size="xl" />
        <VStack space="2" my="2">
          <OrderDetailsTextComponent name="Name" value={order.nameOfService} />
          <OrderDetailsTextComponent name="Price" value={order.price} />
          <OrderDetailsTextComponent name="Qty" value={order.numberOfItems} />
          <OrderDetailsTextComponent name="Total" value={order.total} />
        </VStack>
      </HStack> */}
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
const CustomSellerOrdersScreen = ({ order }: any) => {
  const status = order.status;
  const states = [
    "Awating Agreement",
    "Pending",
    "Approved",
    "Processing",
    "Delivered",
    "EscrowCompleted",
  ];
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  async function updateOrderStatus(orderId: string, status: string) {
    setLoading(true);
    if (status === "Approved") {
      const approve = await fetch(
        "http://157.230.188.72:8080/approve_custom_escrow_order",
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
      const sellerEmail = order.sellerEmail.replace(".", "_");
      //change seller balance
      const sellerRef = ref(db, "users/" + sellerEmail + "/info");
      const seller = await get(sellerRef);
      const sellerData = seller.val();
      const sellerBalance = parseInt(sellerData.balance);
      const customEs = order.customTransfer;
      const newBalance = sellerBalance + parseInt(customEs[0]);
      update(ref(db, "users/" + sellerEmail + "/info"), {
        balance: newBalance,
      });

      //console.log(approve);
    }
    if (status === "Processing") {
      const process = await fetch(
        "http://157.230.188.72:8080/process_custom_escrow_order",
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
      const sellerEmail = order.sellerEmail.replace(".", "_");
      const sellerRef = ref(db, "users/" + sellerEmail + "/info");
      const seller = await get(sellerRef);
      const sellerData = seller.val();
      const sellerBalance = parseInt(sellerData.balance);
      const customEs = order.customTransfer;
      const newBalance = sellerBalance + parseInt(customEs[1]);
      update(ref(db, "users/" + sellerEmail + "/info"), {
        balance: newBalance,
      });
      //console.log(process);
    }
    if (status === "Completed") {
      const deliver = await fetch(
        "http://157.230.188.72:8080/complete_custom_escrow_order",
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
      const sellerEmail = order.sellerEmail.replace(".", "_");
      const sellerRef = ref(db, "users/" + sellerEmail + "/info");
      const seller = await get(sellerRef);
      const sellerData = seller.val();
      const sellerBalance = parseInt(sellerData.balance);
      const customEs = order.customTransfer;
      const newBalance = sellerBalance + parseInt(customEs[2]);
      update(ref(db, "users/" + sellerEmail + "/info"), {
        balance: newBalance,
      });
      //console.log(deliver);
    }

    // const buyerEmail = order.buyerEmail.replace(".", "_");
    // const buyerOrdersRef = ref(db, "users/" + buyerEmail + "/orders");
    // const buyerOrders = await get(buyerOrdersRef);
    // const buyerOrdersData = buyerOrders.val();
    // for (let key in buyerOrdersData) {
    //   if (buyerOrdersData[key].orderId === orderId) {
    //     update(ref(db, "users/" + buyerEmail + "/orders/" + key), {
    //       status: status,
    //     });
    //   }
    // }
    // const sellerEmail = order.sellerEmail.replace(".", "_");
    // const sellerOrdersRef = ref(db, "users/" + sellerEmail + "/orders");
    // const sellerOrders = await get(sellerOrdersRef);
    // const sellerOrdersData = sellerOrders.val();
    // for (let key in sellerOrdersData) {
    //   if (sellerOrdersData[key].orderId === orderId) {
    //     update(ref(db, "users/" + sellerEmail + "/orders/" + key), {
    //       status: status,
    //     });
    //   }
    // }

    //set buyers order status
    const buyer1 = order.buyersEmail[0].replace(".", "_");
    const buyer2 = order.buyersEmail[1].replace(".", "_");

    const buyer1OrdersRef = ref(db, "users/" + buyer1 + "/orders");
    const buyer1Orders = await get(buyer1OrdersRef);
    const buyer1OrdersData = buyer1Orders.val();
    for (let key in buyer1OrdersData) {
      if (buyer1OrdersData[key].orderId === orderId) {
        update(ref(db, "users/" + buyer1 + "/orders/" + key), {
          status: status,
        });
      }
    }
    const buyer2OrdersRef = ref(db, "users/" + buyer2 + "/orders");
    const buyer2Orders = await get(buyer2OrdersRef);
    const buyer2OrdersData = buyer2Orders.val();
    for (let key in buyer2OrdersData) {
      if (buyer2OrdersData[key].orderId === orderId) {
        update(ref(db, "users/" + buyer2 + "/orders/" + key), {
          status: status,
        });
      }
    }

    //set seller order status
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
      {/* <HStack justifyContent={"space-between"} mx="4">
        <Image source={{ uri: order.image }} alt="image" size="xl" />
        <VStack space="2" my="2">
          <OrderDetailsTextComponent name="Name" value={order.nameOfService} />
          <OrderDetailsTextComponent name="Price" value={order.price} />
          <OrderDetailsTextComponent name="Qty" value={order.numberOfItems} />
          <OrderDetailsTextComponent name="Total" value={order.total} />
        </VStack>
      </HStack> */}
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
    <VStack space="2" h="5" mx="2.5">
      {states.indexOf(status) > states.indexOf(state) ? (
        <Stack bg="#347D1B" w="1" h="5" ml="-0.5"></Stack>
      ) : (
        <>
          {Array(5)
            .fill(0)
            .map((_, i) => {
              return <Stack key={i} bg="#1D4A70" w="1" ml="-0.5" h="2"></Stack>;
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
  const [loading, setLoading] = useState(false);
  async function updateOrderStatus(orderId: string, status: string) {
    setLoading(true);
    const process = await fetch("http://157.230.188.72:8080/complete_escrow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderid: orderId,
      }),
    }).finally(() => setLoading(false));
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

    //increase seller balance
    const sellerRef = ref(db, "users/" + sellerEmail + "/info");
    const seller = await get(sellerRef);
    const sellerData = seller.val();
    const sellerBalance = parseInt(sellerData.balance);
    const newSellerBalance = sellerBalance + parseInt(order.total);
    update(ref(db, "users/" + sellerEmail + "/info"), {
      balance: newSellerBalance,
    });
  }
  return (
    <VStack bg="#09151E">
      <ServiceListComponent
        image={order.image}
        name={order.nameOfService}
        category={"Quantity: " + order.numberOfItems.toString()}
        price={order.total}
      >
        {order.status === "Completed" ? (
          loading ? (
            <Spinner size="lg" mx="auto" color="#D9F1FF" />
          ) : (
            <AppButton
              secondary
              onPress={() => {
                updateOrderStatus(order.orderId, "EscrowCompleted");
              }}
              width={"100%"}
            >
              <Text color="white">Complete Escrow</Text>
            </AppButton>
          )
        ) : (
          <Text
            color="#E4FF41"
            fontFamily={"Poppins_800Regular"}
            mx="auto"
            fontSize="2xl"
            fontWeight="bold"
          >
            {order.status === "EscrowCompleted" ? "Completed" : order.status}
          </Text>
        )}
      </ServiceListComponent>
    </VStack>
    // <VStack bg="#12202E" my="3" p="4" rounded={"md"}>
    //   <HStack justifyContent={"space-between"}>
    //     <Image source={{ uri: order.image }} size={"xl"} />
    //     <VStack>
    //       <OrderDetailsTextComponent name="Name" value={order.nameOfService} />
    //       <OrderDetailsTextComponent name="Price" value={order.price} />
    //       <OrderDetailsTextComponent name="Qty" value={order.numberOfItems} />
    //       <OrderDetailsTextComponent name="Total" value={order.total} />
    //       <OrderDetailsTextComponent name="Status" value={order.status} />
    //       {order.status === "Completed" && (
    //         <TouchableOpacity
    //           onPress={() => {
    //             updateOrderStatus(order.orderId, "EscrowCompleted");
    //           }}
    //         >
    //           <Text color="white">Complete Escrow</Text>
    //         </TouchableOpacity>
    //       )}
    //     </VStack>
    //   </HStack>
    // </VStack>
  );
};

const CustomBuyerOrdersScreen = ({ order }: any) => {
  const [loading, setLoading] = useState(false);
  const [isAgreer, setIsAgreer] = useState(false);

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
    <VStack bg="#09151E">
      <ServiceListComponent
        image={order.image}
        name={order.nameOfService}
        category={"Quantity: " + order.numberOfItems.toString()}
        price={order.total}
      >
        <VStack>
        <Text color="white">Share: {order.shares}</Text>
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
              <HStack space="2">
                <Text color="white">Partner</Text>
                <Text color="white">
                  {isAgreer
                    ? order.buyersEmail[1].replace("_", ".")
                    : order.buyersEmail[0].replace("_", ".")}
                </Text>
              </HStack>
            </Stack>
          )
        ) : (
          <>
            {isAgreer && order.status === "Awaiting Agreement" ? (
              <Stack>
                <AppButton
                  secondary
                  onPress={() => {
                    agreeOrder();
                  }}
                  width={"100%"}
                >
                  <Text color="white">Agree</Text>
                </AppButton>
                <HStack space="2">
                  <Text color="white"> Partner</Text>
                  <Text color="white">
                    {isAgreer
                      ? order.buyersEmail[1].replace("_", ".")
                      : order.buyersEmail[0].replace("_", ".")}
                  </Text>
                </HStack>
              </Stack>
            ) : (
              <Stack>
                <Text color="white">{order.status}</Text>
                <HStack space="2">
                  <Text color="white"> Partner</Text>
                  <Text color="white">
                    {isAgreer
                      ? order.buyersEmail[1].replace("_", ".")
                      : order.buyersEmail[0].replace("_", ".")}
                  </Text>
                </HStack>
              </Stack>
            )}
          </>
        )}
        </VStack>
      </ServiceListComponent>
    </VStack>
    // <VStack bg="#12202E" my="3" p="4" rounded={"md"}>
    //   <HStack justifyContent={"space-between"}>
    //     <Image source={{ uri: order.image }} size={"xl"} />
    //     <VStack>
    //       <OrderDetailsTextComponent name="Name" value={order.nameOfService} />
    //       <OrderDetailsTextComponent name="Price" value={order.price} />
    //       <OrderDetailsTextComponent name="Qty" value={order.numberOfItems} />
    //       <OrderDetailsTextComponent name="Total" value={order.total} />
    //       <OrderDetailsTextComponent name="Status" value={order.status} />
    //       {order.status === "Completed" && (
    //         <TouchableOpacity
    //           onPress={() => {
    //             updateOrderStatus(order.orderId, "EscrowCompleted");
    //           }}
    //         >
    //           <Text color="white">Complete Escrow</Text>
    //         </TouchableOpacity>
    //       )}
    //     </VStack>
    //   </HStack>
    // </VStack>
  );
};

const OrderDetailsTextComponent = ({ name, value }: any) => {
  return (
    <HStack space="2">
      <Text w="12" color="white" fontFamily={"Poppins_400Regular"}>
        {name}
      </Text>
      <Text color="white" fontFamily={"Poppins_400Regular"}>
        {value}
      </Text>
    </HStack>
  );
};
