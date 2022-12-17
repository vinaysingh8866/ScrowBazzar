import { FontAwesome } from "@expo/vector-icons";
import { HStack, ScrollView, Stack, Text, ZStack } from "native-base";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

const SelectElement = ({ placeHolder, setState, s, states }: any) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    useEffect(() => {}, [s]);
    return (
      <ZStack
        w="24"
        p="2"
        mx="1"
        bg="#23557A"
        rounded="md"
      >
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <HStack justifyContent={"space-between"}>
            <Text color="white"> {s !== "" ? s : placeHolder}</Text>
            <FontAwesome name="chevron-down" size={20} color="white" />
          </HStack>
        </TouchableOpacity>
  
        {dropdownVisible && (
          <Stack w="24" my="10" h="20" rounded={"md"} zIndex={"11"} overflow="hidden">
            <ScrollView>
              {states.map((state: any, index: number) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setState(state.item);
                      setDropdownVisible(false);
                    }}
                    key={index}
                  >
                    <HStack
                      zIndex={"10"}
                      justifyContent={"space-between"}
                      bg={state.item === s ? "#23476A" : "#19334E"}
                      w="24"
                    >
                      <Text mx="auto" color="white">
                        {state.item}
                      </Text>
                    </HStack>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Stack>
        )}
      </ZStack>
    );
  };

export default SelectElement;