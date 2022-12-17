import { Entypo } from "@expo/vector-icons";
import { HStack, Icon } from "native-base";
import AppButton from "../AppButton";

const LogInButtons = ({
    setState,
    state,
    onPress,
  }: {
    setState: any;
    state: number;
    onPress: any;
  }) => {
    return (
      <HStack
        w="100%"
        h="50px"
        mx="auto"
        rounded="lg"
        position={"absolute"}
        bottom="20%"
        alignSelf={"center"}
      >
        {state > 0 && (
          <AppButton onPress={() => setState(state - 1)} width="20%" secondary={false}>
            <Icon
              as={Entypo}
              name="chevron-left"
              color="white"
              size={"lg"}
            ></Icon>
          </AppButton>
        )}
        <AppButton
          onPress={() => {
            setState(state + 1);
            onPress ? onPress() : () => { };
          } }
          width={state == 0 ? "100%" : "75%"} secondary={false}      >
          Next
        </AppButton>
      </HStack>
    );
  };

export default LogInButtons;