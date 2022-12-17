
import { getDatabase, ref, set } from "firebase/database";
import db from "../../firebase";
import { save } from "../../utils/Storage";
import { Platform } from "react-native";
import { SetStateAction, useState } from "react";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { CheckIcon, HStack, Select, Text, VStack } from "native-base";
import AppTitle from "../AppTitle";
import AppSubtitle from "../AppSubtitile";
import AppInput from "../AppInput";
import LogInButtons from "./LogInButtons";
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
      balance: 0,
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
            onChangeText={(text: SetStateAction<string>) => setName(text)} keyboardType={undefined} maxLength={0} isFocused={undefined}          ></AppInput>
        </HStack>
        <HStack w="100%" h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            width="100%"
            placeholder="Email"
            value={email}
            onChangeText={(text: SetStateAction<string>) => setEmail(text)} keyboardType={undefined} maxLength={0} isFocused={undefined}          ></AppInput>
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

export default AddPersonalDetails;
