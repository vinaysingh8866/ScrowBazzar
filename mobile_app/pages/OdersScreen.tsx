import React, { useEffect, useState } from "react";
import { VStack, HStack, Text, Stack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import db from "../firebase";
import { onValue, ref } from "firebase/database";
import { getValueFor } from "../utils/Storage";

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
      }
    });
  }

  useEffect(() => {
    getMyordersFromDb();
  }, []);
  return (
    <VStack>
      <SafeAreaView>
        {myOrders.map((order,i) => {
          return (
            <Stack>
              {order.sellerEmail===email && <SellerOrdersScreen order={order} />}
              {order.buyerEmail===email && <BuyerOrdersScreen order={order} />}
            </Stack>
          );
        })}
      </SafeAreaView>
    </VStack>
  );
};

export default OrderScreen;

const SellerOrdersScreen = ({oder}:any) => {
  return (
    <VStack>
      <Text>SellerOrdersScreen</Text>
    </VStack>
  );
};

const BuyerOrdersScreen = ({order}:any) => {
  return (
    <VStack>
      <HStack>

        <Text>{order.nameOfService}</Text>
        <Text>{order.price}</Text>
        <Text>{order.status}</Text>
        </HStack>
    </VStack>
  );
};
