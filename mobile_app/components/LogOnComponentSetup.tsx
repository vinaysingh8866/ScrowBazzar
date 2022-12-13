import {
  Button,
  HStack,
  Input,
  Text,
  VStack,
  Select,
  CheckIcon,
  Icon,
} from "native-base";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { Entypo } from "@expo/vector-icons";

import AppTitle from "./AppTitle";
import AppSubtitle from "./AppSubtitile";
import AppInput from "./AppInput";
import AppButton from "./AppButton";

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
        <AppButton onPress={() => setState(state - 1)} width="20%">
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
          onPress ? onPress() : () => {};
        }}
        width={state == 0 ? "100%" : "75%"}
      >
        Next
      </AppButton>
    </HStack>
  );
};

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
        <AppTitle>Verify Your Phone</AppTitle>
        <AppSubtitle>
          We will send you a verification code to your phone number. Please
          enter your phone number below.
        </AppSubtitle>
        <HStack w="100%" h="50px" mx="auto" rounded="lg">
          <AppInput width="20%" placeholder="Code"></AppInput>
          <AppInput width="75%" placeholder="Phone Number"></AppInput>
        </HStack>
        <LogInButtons state={state} setState={setState}></LogInButtons>
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
        <AppTitle>Verify Your Phone</AppTitle>
        <AppSubtitle>
          We have sent you a verification code to your phone number. Please
          enter the code below.
        </AppSubtitle>
        {/** 4 input boxes that take signle digit as input and switch focus on index change**/}
        <HStack w="100%" h="50px" rounded="lg">
          {[0, 1, 2, 3].map((x) => (
            <AppInput
              width="20%"
              placeholder="-"
              value={code[x]}
              onChangeText={(text) => {
                setCode(code.slice(0, x).concat([text], code.slice(x + 1, 4)));
                setIndex(x + 1);
              }}
              maxLength={1}
              keyboardType="number-pad"
              isFocused={index === x}
            ></AppInput>
          ))}
        </HStack>
        <AppTitle>{code}</AppTitle>
        <LogInButtons state={state} setState={setState}></LogInButtons>
      </VStack>
    </Animated.View>
  );
};

const MobileNumberVerified = ({ setState, state }: any) => {
  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <AppTitle>Number Is Verified</AppTitle>

        <LogInButtons state={state} setState={setState}></LogInButtons>
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
    console.log("DONE");
    console.log(res);
  }
  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <AppTitle>Add Personal Details</AppTitle>
        <AppSubtitle>Please enter your personal details below.</AppSubtitle>
        <HStack w="100%" h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            width="100%"
            placeholder="Full Name"
            value={name}
            onChangeText={(text) => setName(text)}
          ></AppInput>
        </HStack>
        <HStack w="100%" h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            width="100%"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          ></AppInput>
        </HStack>
        <HStack w="100%" h="50px" mx="auto" my="2" rounded="lg">
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
        <AppSubtitle>
          By clicking next you agree to our terms and conditions and privacy
        </AppSubtitle>
        <LogInButtons
          state={state}
          setState={setState}
          onPress={() => addUserToFirbase()}
        ></LogInButtons>
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
        <AppTitle>Recovery Phrase</AppTitle>
        <AppSubtitle>
          Please copy and save your recovery phrase below.
        </AppSubtitle>
        <HStack h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            width="100%"
            placeholder="Recovery Phrase"
            value={phrase}
            onChangeText={(text) => setPhrase(text)}
          ></AppInput>
        </HStack>
        <LogInButtons state={state} setState={setState}></LogInButtons>
      </VStack>
    </Animated.View>
  );
};

const CreateWalletPin = ({ setState, state }: any) => {
  const [pin, setPin] = useState("");

  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <AppTitle>Create Wallet Pin</AppTitle>
        <AppSubtitle>
          Please enter a 4 digit pin to secure your wallet.
        </AppSubtitle>
        <HStack h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            width="100%"
            placeholder="Pin"
            value={pin}
            onChangeText={(text) => setPin(text)}
          ></AppInput>
        </HStack>
        <LogInButtons state={state} setState={setState}></LogInButtons>
      </VStack>
    </Animated.View>
  );
};

export default LogOnComponentSetup;
