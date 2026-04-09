import React from "react";
import { Box, Flex, Image, Text, HStack, VStack, Icon } from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa";
import dwarfImg from "../assets/myDwarf.png";

const Navbar = () => (
  <>
    {/* Promo Banner */}
    <Box
      w="100%"
      bg="navy.600"
      py={1.5}
      textAlign="center"
      fontSize="xs"
      fontWeight="semibold"
      letterSpacing="wider"
      color="white"
      position="fixed"
      top={0}
      left={0}
      zIndex={20}
    >
      USE COUPON{" "}
      <Text as="span" color="brand.400" fontWeight="extrabold">
        #ONESHOTMOVEFOR3
      </Text>{" "}
      FOR 3 FREE BOXES!
    </Box>

    {/* Navbar */}
    <Box
      as="nav"
      position="fixed"
      top="28px"
      left={0}
      w="100%"
      bg="white"
      borderBottom="3px solid"
      borderColor="brand.500"
      shadow="md"
      zIndex={19}
    >
      <Flex
        maxW="1100px"
        mx="auto"
        px={[4, 6, 8]}
        h="64px"
        align="center"
        justify="space-between"
      >
        <HStack spacing={3}>
          <Image
            src={dwarfImg}
            alt="Holy Move Gnome"
            boxSize="46px"
            borderRadius="full"
            border="2px solid"
            borderColor="navy.600"
          />
          <VStack spacing={0} align="start">
            <Text
              fontWeight="extrabold"
              fontSize="lg"
              color="navy.600"
              lineHeight="1"
              letterSpacing="tight"
            >
              HOLY MOVE
            </Text>
            <Text fontSize="10px" color="gray.500" lineHeight="1.4" letterSpacing="wide">
              INSTANT MOVING QUOTES
            </Text>
          </VStack>
        </HStack>

        <HStack spacing={4}>
          <HStack spacing={2} display={["none", "none", "flex"]}>
            <Icon as={FaPhone} color="navy.600" boxSize={3} />
            <Text fontWeight="bold" color="navy.600" fontSize="sm">
              877.HOLY.MOVE
            </Text>
          </HStack>
          <Box
            as="a"
            href="/"
            bg="brand.500"
            color="white"
            fontWeight="extrabold"
            fontSize="sm"
            px={5}
            py={2}
            borderRadius="full"
            letterSpacing="0.06em"
            _hover={{ bg: "brand.600", textDecoration: "none" }}
            transition="all 0.2s"
            whiteSpace="nowrap"
          >
            NEW QUOTE
          </Box>
        </HStack>
      </Flex>
    </Box>
  </>
);

export default Navbar;
