import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import dwarfImg from "../assets/myDwarf.png";
import { useNavigate } from "react-router-dom";
import { FaTruckMoving, FaStar, FaShieldAlt } from "react-icons/fa";
import MoveForm from "../components/MoveForm";
import Navbar from "../components/Navbar";
import { health } from "../api/health";

const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === "production" 
    ? "https://ai-truck-helper-1.onrender.com"
    : "http://localhost:3001");
const HERO_BG =
  "https://images.pexels.com/photos/6169661/pexels-photo-6169661.jpeg?auto=compress&cs=tinysrgb&w=1920";

const LandingPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    health()
      .then((r) => console.log("health:", r))
      .catch((e) => console.error("health error:", e));
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setError("");
      const res = await fetch(`${API_URL}/api/helpers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`POST /api/helpers → ${res.status}. ${text}`);
      }
      const data = await res.json();
      let route = null;
      try {
        const routeRes = await fetch(`${API_URL}/api/maps/route`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pickupZip: formData.pickupZip,
            dropoffZip: formData.dropoffZip,
            profile: "driving-car",
          }),
        });
        if (routeRes.ok) {
          const routeJson = await routeRes.json();
          if (Array.isArray(routeJson?.route?.coordinates))
            route = routeJson.route.coordinates;
        }
      } catch {}
      navigate("/result", { state: { result: data, route } });
    } catch (e) {
      setError(e.message || "Request failed");
    }
  };

  return (
    <Box w="100%" minH="100vh" overflowX="hidden">

      <Navbar />

      {/* ── Hero ── */}
      <Box
        position="relative"
        w="100%"
        minH="100vh"
        pt="92px"
        bgImage={`url('${HERO_BG}')`}
        bgSize="cover"
        bgPosition="center"
        bg="navy.800"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        {/* Dark overlay — separate Box instead of _before (Chakra v2 compatible) */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(8,16,40,0.82)"
          zIndex={0}
        />
        <Box
          position="relative"
          zIndex={1}
          w="100%"
          maxW="1100px"
          px={[4, 6, 8]}
          py={[8, 10, 12]}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {/* Headline row */}
          <Flex
            direction={["column", "column", "row"]}
            align="center"
            justify="center"
            gap={[6, 8, 10]}
            mb={[8, 10]}
            w="100%"
          >
            {/* Gnome */}
            <Box flexShrink={0} position="relative">
              <Image
                src={dwarfImg}
                alt="Holy Move Gnome Mascot"
                boxSize={["140px", "170px", "200px"]}
                borderRadius="full"
                border="4px solid"
                borderColor="brand.500"
                shadow="0 0 0 8px rgba(255,98,0,0.20), 0 20px 60px rgba(0,0,0,0.5)"
              />
              {/* Badge */}
              <Box
                position="absolute"
                bottom="-8px"
                left="50%"
                transform="translateX(-50%)"
                bg="brand.500"
                color="white"
                fontSize="10px"
                fontWeight="extrabold"
                px={3}
                py={1}
                borderRadius="full"
                whiteSpace="nowrap"
                letterSpacing="0.06em"
              >
                YOUR MOVE BUDDY
              </Box>
            </Box>

            {/* Text */}
            <VStack
              align={["center", "center", "start"]}
              spacing={4}
              textAlign={["center", "center", "left"]}
            >
              <HStack spacing={1}>
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} as={FaStar} color="brand.400" boxSize={4} />
                ))}
                <Text color="whiteAlpha.800" fontSize="sm" ml={2}>
                  Trusted by 1,000+ families
                </Text>
              </HStack>

              <Heading
                as="h1"
                fontSize={["3xl", "4xl", "5xl", "6xl"]}
                fontWeight="extrabold"
                color="white"
                lineHeight="1.05"
                letterSpacing="tight"
              >
                MOVING MADE{" "}
                <Text as="span" color="brand.400">
                  SIMPLE.
                </Text>
              </Heading>

              <Text
                fontSize={["lg", "xl", "2xl"]}
                fontWeight="bold"
                color="whiteAlpha.900"
                lineHeight="1.3"
              >
                Instant price. Route. Truck info.
                <br />
                <Text as="span" color="brand.300" fontWeight="normal" fontSize={["md", "lg"]}>
                  Enter your ZIP — get a quote in seconds.
                </Text>
              </Text>
            </VStack>
          </Flex>

          {/* ── Form Card ── */}
          <Box
            id="quote-form"
            w="100%"
            maxW="860px"
            bg="white"
            rounded="2xl"
            shadow="0 24px 80px rgba(0,0,0,0.5)"
            overflow="hidden"
          >
            {/* Card header stripe */}
            <Flex bg="navy.600" px={6} py={3} align="center" gap={3}>
              <Icon as={FaTruckMoving} color="brand.400" boxSize={5} />
              <Text color="white" fontWeight="extrabold" fontSize="md" letterSpacing="wide">
                GET YOUR FREE INSTANT QUOTE
              </Text>
            </Flex>

            <Box p={[5, 7]}>
              <MoveForm onSubmit={handleSubmit} />
              {error && (
                <Box
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.200"
                  color="red.700"
                  p={3}
                  rounded="lg"
                  mt={4}
                  fontSize="sm"
                >
                  {error}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Trust Bar ── */}
      <Box
        bg="gray.50"
        borderTop="1px solid"
        borderColor="gray.200"
        py={10}
        px={[4, 6]}
      >
        <SimpleGrid
          columns={[1, 3]}
          spacing={8}
          maxW="860px"
          mx="auto"
          textAlign="center"
        >
          <VStack spacing={2}>
            <Icon as={FaTruckMoving} boxSize={8} color="brand.500" />
            <Text fontSize="3xl" fontWeight="extrabold" color="navy.600" lineHeight="1">
              1,000+
            </Text>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
              Moves Completed
            </Text>
          </VStack>

          <VStack spacing={2}>
            <Icon as={FaStar} boxSize={8} color="brand.500" />
            <Text fontSize="3xl" fontWeight="extrabold" color="navy.600" lineHeight="1">
              4.9 ★
            </Text>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
              Average Rating
            </Text>
          </VStack>

          <VStack spacing={2}>
            <Icon as={FaShieldAlt} boxSize={8} color="brand.500" />
            <Text fontSize="3xl" fontWeight="extrabold" color="navy.600" lineHeight="1">
              100%
            </Text>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
              Licensed & Insured
            </Text>
          </VStack>
        </SimpleGrid>
      </Box>

    </Box>
  );
};

export default LandingPage;
