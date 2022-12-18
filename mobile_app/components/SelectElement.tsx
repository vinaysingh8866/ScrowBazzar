import { FontAwesome } from "@expo/vector-icons";
import { HStack, ScrollView, Stack, Text, ZStack } from "native-base";
import { useEffect, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";

const SelectElement = ({ placeHolder, setState, s, states }: any) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  useEffect(() => {}, [s]);
  return (
    <ZStack w="30%" bg="#193F60" rounded="lg" justifyContent={"space-around"}>
      <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
        <HStack justifyContent={"space-between"} px="2">
          <Text color={s === "" ? "gray.400" : "#D9F1FF"}>
            {" "}
            {s !== "" ? s : placeHolder}
          </Text>
          {dropdownVisible ? (
            <FontAwesome name="chevron-up" size={20} color="#D9F1FF" />
          ) : (
            <FontAwesome name="chevron-down" size={20} color="#D9F1FF" />
          )}
        </HStack>
      </TouchableOpacity>

      {dropdownVisible && (
        <HStack w="100%" h="150px" rounded={"lg"} overflow="hidden" my="50px">
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
                    h="40px"
                    justifyContent={"space-between"}
                    bg={state.item === s ? "#23476A" : "#19334E"}
                  >
                    <Text mx="auto" color="white" alignSelf={"center"}>
                      {state.item}
                    </Text>
                  </HStack>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </HStack>
      )}
    </ZStack>
  );
};

export default SelectElement;
