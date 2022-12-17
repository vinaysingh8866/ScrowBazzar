import { Text } from "native-base";

function AppTitle({ children }: { children: any }) {
  return (
    <Text
      color="#E4FF41"
      fontFamily={"Poppins_800Regular"}
      mx="2"
      fontSize={"25"}
      fontWeight="bold"
    >
      {children}
    </Text>
  );
}

export default AppTitle;
