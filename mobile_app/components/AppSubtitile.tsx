import { Text } from "native-base";

function AppSubtitle({ children }: { children: string }) {
  return (
    <Text
      color="#D9F1FF"
      fontFamily={"Poppins_400Regular"}
      mx="2"
      fontSize={"15"}
      my="1"
    >
      {children}
    </Text>
  );
}

export default AppSubtitle;
