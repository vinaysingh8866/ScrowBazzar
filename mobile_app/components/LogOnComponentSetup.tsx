import {
  Button,
  HStack,
  Input,
  Text,
  VStack,
  Select,
  CheckIcon,
} from "native-base";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
const LogOnComponentSetup = ({
  setState,
  state,
}: {
  setState: any;
  state: number;
}) => {
  //change page based on state with  slide animation

  useEffect(() => {}, [state]);

  return (
    <VStack mx="auto" w="90%" my="-9%" h="90%" rounded="lg">
      {state === 0 && (
        <PhoneNumberVerification setState={setState} state={state} />
      )}

      {state === 1 && <VerificationCode setState={setState} state={state} />}
      {state === 2 && (
        <MobileNumberVerified setState={setState} state={state} />
      )}
      {state === 3 && <AddPersonalDetails setState={setState} state={state} />}
      {state === 4 && <RecoveryPhrase setState={setState} state={state} />}
      {state === 5 && <CreateWalletPin setState={setState} state={state} />}
    </VStack>
  );
};

const PhoneNumberVerification = ({ setState, state }: any) => {
  //slide in when state is 0
  //slide out when state is 1

  useEffect(() => {}, [state]);

  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <Text
          color="#E4FF41"
          fontFamily={"Poppins_400Regular"}
          mx="2"
          fontSize={"20"}
        >
          Verify Your Phone
        </Text>
        <Text
          color={"white"}
          fontFamily={"Poppins_400Regular"}
          mx="auto"
          fontSize={"15"}
          my="10%"
        >
          We will send you a verification code to your phone number. Please
          enter your phone number below.
        </Text>
        <HStack w="100%" h="10%" mx="auto" my="10%" rounded="lg">
          <Input
            bg="#1E2C3D"
            w="20%"
            h="100%"
            rounded="lg"
            placeholder="Code"
            _placeholder={{ color: "white" }}
            color="white"
          />
          <Input
            bg="#1E2C3D"
            w="80%"
            h="100%"
            rounded="lg"
            placeholder="Phone Number"
            _placeholder={{ color: "white" }}
            color="white"
          />
        </HStack>

        <Button
          onPress={() => setState(state + 1)}
          bg="#4030FB"
          w="90%"
          h="10"
          mx="auto"
          my="80%"
          rounded="full"
          _text={{ color: "white" }}
        >
          Next
        </Button>
      </VStack>
    </Animated.View>
  );
};

const VerificationCode = ({ setState, state }: any) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    //change the focus of the input box
  }, [code, index]);
  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <Text
          color="#E4FF41"
          fontFamily={"Poppins_400Regular"}
          mx="2"
          fontSize={"20"}
        >
          Verify Your Phone
        </Text>
        <Text
          color={"white"}
          fontFamily={"Poppins_400Regular"}
          mx="auto"
          fontSize={"15"}
          my="10%"
        >
          We have sent you a verification code to your phone number. Please
          enter the code below.
        </Text>
        {/** 4 input boxes that take signle digit as input and switch focus on index change**/}
        <HStack space="2" w="100%" h="10%" mx="4" my="10%" rounded="lg">
          <Input
            bg="#1E2C3D"
            w="20%"
            h="100%"
            rounded="lg"
            placeholder="-"
            _placeholder={{ color: "white" }}
            color="white"
            value={code[0]}
            onChangeText={(text) => {
              setCode([text, code[1], code[2], code[3]]);
              setIndex(1);
            }}
            maxLength={1}
            keyboardType="number-pad"
            isFocused={index === 0}
          />
          <Input
            bg="#1E2C3D"
            w="20%"
            h="100%"
            rounded="lg"
            placeholder="-"
            _placeholder={{ color: "white" }}
            color="white"
            value={code[1]}
            onChangeText={(text) => {
              setCode([code[0], text, code[2], code[3]]);
              setIndex(2);
            }}
            maxLength={1}
            keyboardType="number-pad"
            isFocused={index === 1}
          />
          <Input
            bg="#1E2C3D"
            w="20%"
            h="100%"
            rounded="lg"
            placeholder="-"
            _placeholder={{ color: "white" }}
            color="white"
            value={code[2]}
            onChangeText={(text) => {
              setCode([code[0], code[1], text, code[3]]);
              setIndex(3);
            }}
            maxLength={1}
            keyboardType="number-pad"
            isFocused={index === 2}
          />
          <Input
            bg="#1E2C3D"
            w="20%"
            h="100%"
            rounded="lg"
            placeholder="-"
            _placeholder={{ color: "white" }}
            color="white"
            value={code[3]}
            onChangeText={(text) => {
              setCode([code[0], code[1], code[2], text]);
              setIndex(4);
            }}
            maxLength={1}
            keyboardType="number-pad"
            isFocused={index === 3}
          />
        </HStack>

        <Button
          onPress={() => setState(state + 1)}
          bg="#4030FB"
          w="90%"
          h="10"
          mx="auto"
          my="80%"
          rounded="full"
          _text={{ color: "white" }}
        >
          Next
        </Button>
      </VStack>
    </Animated.View>
  );
};

const MobileNumberVerified = ({ setState, state }: any) => {
  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <Text
          color="#E4FF41"
          fontFamily={"Poppins_400Regular"}
          mx="2"
          fontSize={"20"}
        >
          Number Is Verified
        </Text>

        <Button onPress={() => setState(state + 1)} bg="#4030FB" w="90%" h="10">
          Next
        </Button>
      </VStack>
    </Animated.View>
  );
};

import { getDatabase, ref, set } from "firebase/database";
import db from "../firebase";
import { save } from "../utils/Storage";
import { Platform } from "react-native";
const AddPersonalDetails = ({ setState, state }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  async function addUserToFirbase() {
    // get db instance from firebase

    // create a new user object
    const user = {
      name: name,
      email: email,
      dob: day + "/" + month + "/" + year,
    };
    //replace the special characters in the email with a _
    user.email = user.email.replace(/[.#$[\]]/g, "_").toLocaleLowerCase();

    // add the user to the database
    const res = await set(ref(db, "users/" + user.email + "/info"), user);
    //add user name to app storage
    await save("name", user.name);
    //add user email to app storage
    await save("email", user.email);
    console.log(res);
  }
  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <Text
          color="#E4FF41"
          fontFamily={"Poppins_400Regular"}
          mx="2"
          fontSize={"20"}
        >
          Add Personal Details
        </Text>
        <Text
          color={"white"}
          fontFamily={"Poppins_400Regular"}
          mx="auto"
          fontSize={"15"}
          my="10%"
        >
          Please enter your personal details below.
        </Text>
        <HStack w="100%" mx="auto" my="10%" rounded="lg">
          <Input
            bg="#1E2C3D"
            w="100%"
            h="10"
            rounded="lg"
            placeholder="Full Name"
            _placeholder={{ color: "white" }}
            color="white"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </HStack>

        {/** Input box for entering email**/}
        <HStack w="100%" mx="auto" my="10%" rounded="lg">
          <Input
            bg="#1E2C3D"
            w="100%"
            h="10"
            rounded="lg"
            placeholder="Email"
            _placeholder={{ color: "white" }}
            color="white"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </HStack>

        <HStack space="2" w="100%" mx="auto" rounded="lg">
          <Select
            bg="#1E2C3D"
            w="100"
            h="10"
            rounded="lg"
            placeholder="Day"
            _placeholder={{ color: "white" }}
            color="white"
            selectedValue={day}
            onValueChange={(itemValue) => setDay(itemValue)}
            _selectedItem={{
              bg: "#4030FB",
              endIcon: <CheckIcon size={4} />,
            }}
            shouldRasterizeIOS={true}
            tintColor="#4030FB"
            mode="dropdown"
            backgroundColor={"#1E2C3D"}
            background={"#1E2C3D"}
            bgColor={"#1E2C3D"}
          >
            {Array.from(Array(31).keys()).map((i) => {
              return (
                <Select.Item
                  key={i}
                  label={i.toString()}
                  value={i.toString()}
                />
              );
            })}
          </Select>
          <Select
            bg="#1E2C3D"
            w="100"
            h="10"
            rounded="lg"
            placeholder="Month"
            _placeholder={{ color: "white" }}
            color="white"
            selectedValue={month}
            onValueChange={(itemValue) => setMonth(itemValue)}
            _selectedItem={{
              bg: "#4030FB",
              endIcon: <CheckIcon size={4} />,
            }}
          >
            <Text>{month}</Text>
            {Array.from(Array(12).keys()).map((i) => {
              return (
                <Select.Item
                  my="1"
                  key={i}
                  label={i.toString()}
                  value={i.toString()}
                />
              );
            })}
          </Select>
          <Select
            bg="#1E2C3D"
            w="100"
            h="10"
            rounded="lg"
            placeholder="Year"
            _placeholder={{ color: "white" }}
            onValueChange={(itemValue) => setYear(itemValue)}
            color="white"
            selectedValue={year}
            _selectedItem={{
              bg: "#4030FB",
              endIcon: <CheckIcon size={4} />,
            }}
          >
            {Array.from(Array(100).keys()).map((i) => {
              return (
                <Select.Item
                  key={i}
                  label={i.toString()}
                  value={i.toString()}
                />
              );
            })}
          </Select>
        </HStack>
        <Text
          color={"white"}
          fontFamily={"Poppins_400Regular"}
          mx="auto"
          fontSize={"15"}
          my="10%"
        >
          By clicking next you agree to our terms and conditions and privacy
        </Text>
        <Button
          onPress={() => {
            setState(state + 1);
            addUserToFirbase();
          }}
          bg="#4030FB"
          w="90%"
          h="10"
          mx="auto"
          my="40%"
          rounded="full"
          _text={{ color: "white" }}
        >
          Next
        </Button>
      </VStack>
    </Animated.View>
  );
};

const RecoveryPhrase = ({ setState, state }: any) => {
  const [phrase, setPhrase] = useState("");
  const [phrase2, setPhrase2] = useState("");

  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <Text
          color="#E4FF41"
          fontFamily={"Poppins_400Regular"}
          mx="2"
          fontSize={"20"}
        >
          Recovery Phrase
        </Text>
        <Text
          color={"white"}
          fontFamily={"Poppins_400Regular"}
          mx="auto"
          fontSize={"15"}
          my="10%"
        >
          Please copy and save your recovery phrase below.
        </Text>
        <HStack w="100%" mx="auto" my="10%" rounded="lg">
          <Input
            bg="#1E2C3D"
            w="100%"
            h="10"
            rounded="lg"
            placeholder="Recovery Phrase"
            _placeholder={{ color: "white" }}
            color="white"
            value={phrase}
            onChangeText={(text) => setPhrase(text)}
          />
        </HStack>

        <Button onPress={() => setState(state + 1)} bg="#4030FB" w="90%" h="10">
          Next
        </Button>
      </VStack>
    </Animated.View>
  );
};

const CreateWalletPin = ({ setState, state }: any) => {
  const [pin, setPin] = useState("");

  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <Text
          color="#E4FF41"
          fontFamily={"Poppins_400Regular"}
          mx="2"
          fontSize={"20"}
        >
          Create Wallet Pin
        </Text>
        <Text
          color={"white"}
          fontFamily={"Poppins_400Regular"}
          mx="auto"
          fontSize={"15"}
          my="10%"
        >
          Please enter a 4 digit pin to secure your wallet.
        </Text>
        <HStack w="100%" mx="auto" my="10%" rounded="lg">
          <Input
            bg="#1E2C3D"
            w="100%"
            h="10"
            rounded="lg"
            placeholder="Pin"
            _placeholder={{ color: "white" }}
            color="white"
            value={pin}
            onChangeText={(text) => setPin(text)}
          />
        </HStack>
        <Button onPress={() => setState(state + 1)} bg="#4030FB" w="90%" h="10">
          Next
        </Button>
      </VStack>
    </Animated.View>
  );
};

export default LogOnComponentSetup;
