import { ref, set } from "firebase/database";
import db from "../../firebase";
import { days, months, save, years } from "../../utils/Storage";
import { useState } from "react";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { HStack, Stack, VStack } from "native-base";
import AppTitle from "../AppTitle";
import AppSubtitle from "../AppSubtitile";
import AppInput from "../AppInput";
import LogInButtons from "./LogInButtons";
import SelectElement from "../SelectElement";

const AddPersonalDetails = ({ setState, state }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  async function addUserToFirbase() {
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
    //console.log("DONE");
    //console.log(res);
  }
  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <VStack mx="auto" p="4" w="100%" bg="#12202E" h="100%" rounded="lg">
        <AppTitle>Add Personal Details</AppTitle>
        <AppSubtitle>Please enter your personal details below.</AppSubtitle>
        <HStack w="100%" h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            secondary
            width="100%"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            keyboardType={undefined}
            maxLength={100}
            isFocused={undefined}
          ></AppInput>
        </HStack>

        <HStack w="100%" h="50px" mx="auto" my="2" rounded="lg">
          <AppInput
            secondary
            width="100%"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType={undefined}
            maxLength={100}
            isFocused={undefined}
          ></AppInput>
        </HStack>
        <HStack
          w="100%"
          h="50px"
          rounded="lg"
          mx="auto"
          my="2"
          justifyContent={"space-between"}
        >
          <SelectElement
            setState={setDay}
            s={day}
            states={days}
            placeHolder="Day"
          />
          <SelectElement
            setState={setMonth}
            s={month}
            states={months}
            placeHolder="Month"
          />
          <SelectElement
            setState={setYear}
            s={year}
            states={years}
            placeHolder="Year"
          />
        </HStack>
        {/* <Stack bottom="2">
          <AppSubtitle>
            By clicking next you agree to our terms and conditions and privacy
          </AppSubtitle>
        </Stack> */}
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
