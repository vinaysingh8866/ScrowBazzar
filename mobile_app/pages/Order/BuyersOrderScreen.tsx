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
import ServiceListComponent from "../../components/ServiceListComponent";
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

export default BuyerOrdersScreen;
