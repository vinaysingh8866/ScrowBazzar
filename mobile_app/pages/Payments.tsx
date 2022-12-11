import { Text, VStack } from "native-base";
import { SafeAreaView, TouchableHighlight } from "react-native";
import RazorpayCheckout, { CheckoutOptions } from "react-native-razorpay";

const Payments = () => {
  return (
    <SafeAreaView>
      <VStack>
        <TouchableHighlight
          onPress={() => {
            var options: CheckoutOptions = {
              description: "Credits towards consultation",
              image: "https://i.imgur.com/3g7nmJC.jpg",
              currency: "INR",
              key: "rzp_test_SMC9R0U4zamAnK",
              amount: 100,
              name: "Acme Corp",
              order_id: "order_KqGJ6z2gDeDOKS", //Replace this with an order_id created using Orders API.
              prefill: {
                email: "gaurav.kumar@example.com",
                contact: "9191919191",
                name: "Gaurav Kumar",
              },
              theme: { color: "#53a20e" },
            };
            RazorpayCheckout.open(options)
              .then((data) => {
                // handle success
                alert(`Success: ${data.razorpay_payment_id}`);
              })
              .catch((error) => {
                // handle failure
                alert(`Error: ${error.code} | ${error.description}`);
              });
          }}
        >
          <Text>Pay Now</Text>
        </TouchableHighlight>
      </VStack>
    </SafeAreaView>
  );
};

export default Payments;
