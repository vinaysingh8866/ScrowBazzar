import { Input } from "native-base";
import { useEffect } from "react";

function AppInput({
  width = "100%",
  placeholder = "",
  value = "",
  onChangeText = () => {},
  maxLength = 1000,
  keyboardType = "default",
  isFocused = false,
}: {
  width: string;
  placeholder: string;
  keyboardType: any;
  maxLength: number;
  value: any;
  onChangeText: any;
  isFocused: any;
}) {
  useEffect(() => {}, [
    value,
    onChangeText,
    maxLength,
    keyboardType,
    isFocused,
  ]);

  return (
    <Input
      bg="#23557A"
      w={width}
      h="100%"
      mx="auto"
      rounded="lg"
      placeholder={placeholder}
      fontSize={15}
      _placeholder={{ color: "#32627E" }}
      color="#D9F1FF"
      borderWidth={0}
      value={value}
      onChangeText={(text) => onChangeText(text)}
      maxLength={maxLength}
      keyboardType={keyboardType}
      isFocused={isFocused}
    />
  );
}

export default AppInput;
