import { IconButton, MoonIcon, SunIcon, Tooltip, useColorMode } from "native-base";
import React from "react";
function ColorModeSwitch() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
      <Tooltip
        label={colorMode === "dark" ? "Enable light mode" : "Enable dark mode"}
        placement="bottom left"
        openDelay={300}
        closeOnClick={false}
      >
        <IconButton
          position="absolute"
          bottom={12}
          right={10}
          onPress={toggleColorMode}
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          accessibilityLabel="Color Mode Switch"
        />
      </Tooltip>
    );
  }

export default ColorModeSwitch;