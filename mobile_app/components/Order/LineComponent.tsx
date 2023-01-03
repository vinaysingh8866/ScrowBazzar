import React from "react";
import { VStack, Stack } from "native-base";
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

export default LineComponent;
