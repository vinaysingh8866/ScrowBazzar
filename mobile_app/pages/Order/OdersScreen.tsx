import React, { useEffect, useState } from "react";
import { VStack, HStack, Text, Stack, ScrollView } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import db from "../../firebase";
import { get, onValue, ref, update } from "firebase/database";
import { getValueFor } from "../../utils/Storage";
import AppTitleBar from "../../components/AppTitleBar";
import AppToggle from "../../components/AppToggle";
import BuyerOrdersScreen from "./BuyersOrderScreen";
import SellerOrdersScreen from "./SellerOrderScreen";
import CustomSellerOrdersScreen from "./CustomSellerOrderScreen";
import CustomBuyerOrdersScreen from "./CustomBuyerOrdersScreen";

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
            <ScrollView h="85%" bg="#09151E">
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
            <ScrollView h="85%" bg="#09151E">
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
