import { Button, HStack, VStack } from "native-base";
import AppButton from "../AppButton";
import AppInput from "../AppInput";

const AddFunds = ({ value, setValue }: any) => {
  let amounts = ["100", "500", "1000", "5000", "10000"];
  return (
    <VStack bg="rgba(0,0,0,0)">
      <VStack p="2">
        <HStack h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            placeholder="Enter Amount"
            value={value}
            width="75%"
            keyboardType={"default"}
            maxLength={1000}
            onChangeText={(text:any) => {
              setValue(text);
            }}
            isFocused={false}
          ></AppInput>
          <AppButton onPress={() => setValue("0")} width="20%" secondary={true}>
            Clear
          </AppButton>
        </HStack>
        <HStack w="100%" h="25px" mx="auto" my="1">
          {amounts.map((amount, i) => (
            <Button
              key={i}
              onPress={() =>
                setValue((parseFloat(value) + parseFloat(amount)).toString())
              }
              variant="outline"
              rounded="full"
              mx=".5"
              py="0"
              borderColor="#8EF140"
              _text={{ color: "#8EF140", fontSize: "12px" }}
            >
              {"+ " + amount}
            </Button>
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
};

export default AddFunds;
