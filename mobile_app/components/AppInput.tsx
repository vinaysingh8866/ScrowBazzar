import { Input } from "native-base";

function AppInput({
  width = "100%",
  placeholder,
  value,
  onChangeText,
  maxLength,
  keyboardType,
  isFocused,
}: {
  width: string;
  placeholder: string;
  keyboardType: any;
  maxLength: number;
  value: any;
  onChangeText: any;
  isFocused: any;
}) {
  return (
    <Input
      bg="#19334E"
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
      onChangeText={onChangeText}
      maxLength={maxLength}
      keyboardType={keyboardType}
      isFocused={isFocused}
    />
  );
}

export default AppInput;
