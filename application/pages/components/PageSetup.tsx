import { Center, HStack, VStack } from "native-base"
import ColorModeSwitch from "./ColorModeSwitch"
import NavBar from "./NavBar"
import React from "react"
const PageSetup = ({children}:any ) => {

    return(

        <HStack w="100vw" h="100vh">
            <NavBar/>
        </HStack>
    //     <Center
    //   flex={1}
    //   _dark={{ bg: "blueGray.900" }}
    //   _light={{ bg: "blueGray.50" }}
    // >
    //   <VStack alignItems="center" space="md">
    //     <HStack alignItems="center" space="2xl">
          
    //     </HStack>
    //   </VStack>
      
      
    // </Center>
    )
}

export default PageSetup