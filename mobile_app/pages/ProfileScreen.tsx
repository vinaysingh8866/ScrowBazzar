import React, { useEffect, useState } from "react";
import { HStack, Image, ScrollView, Stack, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { getValueFor } from "../utils/Storage";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import db, { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { push, ref as dbRef } from "firebase/database";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import AppTitle from "../components/AppTitle";
import AppSubtitle from "../components/AppSubtitile";
import AppTitleBar from "../components/AppTitleBar";
const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameOfService, setNameOfService] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const name = getValueFor("name");
    const email = getValueFor("email");
    name.then((name: string) => {
      setName(name);
    });
    email.then((email: string) => {
      //replace _ with . in email
      email = email.replace(/_/g, ".");
      setEmail(email.toLowerCase());
    });
  }, []);

  async function addServiceToDataBase() {
    if (nameOfService !== "" && price !== "" && description !== "") {
      // replace . with _ in email
      let emailL = email.replace(/\./g, "_");
      const serviceRef = dbRef(
        db,
        "users/" + emailL.toLocaleLowerCase() + "/services/"
      );
      const service = {
        nameOfService: nameOfService,
        price: price,
        description: description,
        image: image,
      };
      //push service to serviceRef
      push(serviceRef, service);

      const MarketServices = dbRef(db, "marketServices/");
      const marketService = {
        nameOfService: nameOfService,
        price: price,
        description: description,
        image: image,
        email: email,
      };
      push(MarketServices, marketService);
    }
  }

  async function selectImageFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (result.assets !== null) {
        const fileUri = result.assets[0].uri;
        console.log(fileUri);
        const response = await fetch(fileUri);
        setImage(fileUri);
        console.log(response);

        const blob = await response.blob();
        const storage = getStorage(app);
        const id = await uuidv4();
        const storageRef = ref(storage, "images/" + email + "/services/" + id);
        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            // const progress =
            //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                
                break;
              case "running":
                
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads

          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              setImage(downloadURL);
            });
          }
        );
      }
    }
  }
  return (
    <VStack bg="#060D16" w="100%" h="100%">
      <SafeAreaView>
        <AppTitleBar title="Profile" back={false} onPress={undefined}></AppTitleBar>
        <VStack px="2">
          <Stack px="2">
            <AppTitle>{name}</AppTitle>
            <AppSubtitle>{email}</AppSubtitle>
          </Stack>
          <ScrollView>
            <VStack px="4" paddingTop={"4"} mx="auto" w="100%">
              <TouchableOpacity onPress={selectImageFromGallery}>
                <Stack
                  w="100%"
                  h="250px"
                  bg={image ? "#060D16" : "#12202E"}
                  my="2"
                  rounded={"lg"}
                >
                  <Stack mx="auto" my="auto">
                    <Stack mx="auto">
                      {image !== "" ? (
                        <Image
                          source={{ uri: image }}
                          alt="image base"
                          size="250"
                          rounded="md"
                        />
                      ) : (
                        <FontAwesome name="image" size={30} color="#D9F1FF" />
                      )}
                    </Stack>

                    {image === "" ? (
                      <AppSubtitle>Tap here to add Image</AppSubtitle>
                    ) : null}
                  </Stack>
                </Stack>
              </TouchableOpacity>

              <HStack w="100%" h="50px" mx="auto" my="2" rounded="lg">
                <AppInput
                  placeholder="Serivice Name"
                  value={nameOfService}
                  onChangeText={setNameOfService}
                  width={"100%"}
                  maxLength={1000}
                  keyboardType={"default"}
                  isFocused={false} secondary={false}                ></AppInput>
              </HStack>
              <HStack w="100%" h="130px" mx="auto" my="2">
                <AppInput
                  placeholder="Description"
                  value={description}
                  onChangeText={setDescription}
                  width={"100%"}
                  maxLength={1000}
                  keyboardType={"default"}
                  isFocused={false} secondary={false}                ></AppInput>
              </HStack>
              <HStack w="100%" h="50px" mx="auto" my="2">
                <AppInput
                  placeholder="Price"
                  value={price}
                  onChangeText={setPrice}
                  width={"100%"}
                  maxLength={100}
                  keyboardType={"default"}
                  isFocused={false} secondary={false}                ></AppInput>
              </HStack>
              <HStack w="100%" h="50px" mx="auto" my="2">
                <AppButton
                  onPress={addServiceToDataBase}
                  width={"100%"}
                  secondary={false}
                >
                  Add Service
                </AppButton>
              </HStack>
            </VStack>
          </ScrollView>
        </VStack>
      </SafeAreaView>
    </VStack>
  );
};

export default ProfileScreen;
export async function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
