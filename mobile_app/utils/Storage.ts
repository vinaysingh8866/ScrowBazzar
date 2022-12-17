import * as SecureStore from "expo-secure-store";

async function save(key: string, value: any) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: string): Promise<string> {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return "0";
  }
}

async function deleteValueFor(key: string) {
    await SecureStore.deleteItemAsync(key);
}

export { save, getValueFor , deleteValueFor};