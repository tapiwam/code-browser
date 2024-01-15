import { HStack, Image } from "@chakra-ui/react";
// import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ColorModeSwitch";
import reactLogo from "../assets/react.svg";

const NavBar = () => {
  return (
    <HStack justifyContent="space-between" padding="10px">
      <Image src={reactLogo} alt="logo" boxSize="30px" />
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
