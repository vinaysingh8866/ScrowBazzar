import { HStack, Image, Text, VStack } from "native-base";

function ServiceListComponent({
  image,
  name,
  category,
  price,
  children,
}: {
  image: any;
  name: string;
  category: string;
  price: any;
  children: any;
}) {
  return (
    <HStack w="100%" h="200px" rounded="lg" my="2">
      <VStack w="50%" rounded={"lg"} bgColor="#1A3147">
        <Image src={image} alt="image" h="200px" w="200px" rounded={"md"} />
      </VStack>
      <VStack
        mx="auto"
        w="50%"
        my="4"
        p="4"
        roundedBottomRight={"lg"}
        roundedTopRight={"lg"}
        justifyContent={"space-between"}
        bg="#12202E"
      >
        <VStack w="100%">
          <Text color="white" fontWeight={"black"} fontSize={18}>
            {name}
          </Text>
          <Text color="#D9F1FF" fontWeight={"400"} fontSize={15}>
            {category}
          </Text>
          <Text color="white" fontWeight={"bold"}>
            ₹{price}
          </Text>
        </VStack>
        <HStack w="100%" h="50px">
          {children}
        </HStack>
      </VStack>
    </HStack>
  );
}

export default ServiceListComponent;
