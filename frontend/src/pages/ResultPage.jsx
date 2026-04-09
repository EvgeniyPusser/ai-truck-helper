import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Badge,
  Divider,
  Grid,
  GridItem,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  FaTruckMoving,
  FaClock,
  FaRoute,
  FaStar,
  FaPhone,
  FaCheck,
  FaTimes,
  FaShieldAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import USAMap from "../components/USAMap";
import Navbar from "../components/Navbar";

const formatCurrency = (amount) => `$${Number(amount).toLocaleString()}`;

/* ── Small stat card in the summary bar ── */
const StatCard = ({ icon, label, value, valueColor = "navy.600" }) => (
  <VStack
    spacing={1}
    bg="white"
    rounded="xl"
    p={4}
    shadow="sm"
    border="1px solid"
    borderColor="gray.200"
    flex={1}
    minW={0}
  >
    <Icon as={icon} color="brand.500" boxSize={5} />
    <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
      {label}
    </Text>
    <Text fontSize="xl" fontWeight="extrabold" color={valueColor}>
      {value}
    </Text>
  </VStack>
);

/* ── Individual mover quote card ── */
const HelperCard = ({ helper, index }) => {
  const isBest = index === 0;
  return (
    <Box
      bg="white"
      rounded="2xl"
      shadow="md"
      border="2px solid"
      borderColor={isBest ? "brand.500" : "gray.200"}
      overflow="hidden"
      position="relative"
      transition="box-shadow 0.2s"
      _hover={{ shadow: "lg" }}
    >
      {/* Best value ribbon */}
      {isBest && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bg="brand.500"
          py={1}
          textAlign="center"
        >
          <Text color="white" fontSize="xs" fontWeight="extrabold" letterSpacing="widest">
            ★ BEST VALUE
          </Text>
        </Box>
      )}

      <Box p={6} pt={isBest ? 8 : 6}>
        {/* Header row */}
        <Grid templateColumns={["1fr", "2fr 1fr"]} gap={4} mb={4}>
          <GridItem>
            <HStack mb={2} spacing={3}>
              <Box
                bg="navy.600"
                p={2}
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaTruckMoving} color="brand.400" boxSize={5} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="xl" fontWeight="extrabold" color="navy.600">
                  {helper.name}
                </Text>
                <HStack spacing={2}>
                  <HStack spacing={1}>
                    <Icon as={FaStar} color="brand.400" boxSize={3} />
                    <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                      {helper.rating}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.400">•</Text>
                  <Text fontSize="sm" color="gray.600">{helper.source}</Text>
                  <Text fontSize="sm" color="gray.400">•</Text>
                  <Text fontSize="sm" color="gray.600">{helper.experience}</Text>
                </HStack>
              </VStack>
            </HStack>

            <HStack>
              <Icon as={FaPhone} color="brand.500" boxSize={4} />
              <Text color="navy.600" fontWeight="semibold" fontSize="sm">
                {helper.phone}
              </Text>
              <Badge
                colorScheme={helper.availability === "Available Today" ? "green" : "blue"}
                variant="subtle"
                borderRadius="full"
                px={2}
              >
                {helper.availability}
              </Badge>
            </HStack>
          </GridItem>

          <GridItem textAlign={["left", "right"]}>
            <Text fontSize="3xl" fontWeight="extrabold" color="brand.500" lineHeight="1">
              {formatCurrency(helper.rate)}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={1}>
              ${helper.hourlyRate}/hr · {helper.helperCount} helpers
            </Text>
            <Text fontSize="sm" color="gray.500">
              Est. {helper.estimatedTime} hrs total
            </Text>
          </GridItem>
        </Grid>

        {/* Truck info */}
        <Box bg="navy.50" border="1px solid" borderColor="navy.100" p={4} rounded="xl" mb={4}>
          <HStack mb={2}>
            <Text fontSize="sm" fontWeight="extrabold" color="navy.600" textTransform="uppercase" letterSpacing="wide">
              🚚 Truck: {helper.truck?.name}
            </Text>
          </HStack>
          <SimpleGrid columns={[2, 3]} spacing={2}>
            <Text fontSize="xs" color="gray.600">Vol: {helper.truck?.volume_m3} m³</Text>
            <Text fontSize="xs" color="gray.600">Max: {helper.truck?.max_weight_kg} kg</Text>
            <Text fontSize="xs" color="gray.600">${helper.truck?.dailyRate}/day + ${helper.truck?.mileageRate}/mi</Text>
          </SimpleGrid>
          {helper.truck?.description && (
            <Text fontSize="xs" color="gray.500" mt={1}>{helper.truck.description}</Text>
          )}
        </Box>

        {/* Services */}
        <Box bg="gray.50" p={4} rounded="xl" mb={4}>
          <Text fontSize="sm" fontWeight="extrabold" color="navy.600" textTransform="uppercase" letterSpacing="wide" mb={3}>
            Services Included
          </Text>
          <SimpleGrid columns={2} spacing={2}>
            {[
              ["Packing Service", helper.services?.packing],
              ["Unpacking Service", helper.services?.unpacking],
              ["Furniture Assembly", helper.services?.furniture_assembly],
              ["Storage Available", helper.services?.storage],
            ].map(([label, ok]) => (
              <HStack key={label} spacing={2}>
                <Icon
                  as={ok ? FaCheck : FaTimes}
                  color={ok ? "green.500" : "red.400"}
                  boxSize={3}
                />
                <Text fontSize="sm" color="gray.700">{label}</Text>
              </HStack>
            ))}
          </SimpleGrid>
        </Box>

        {/* Specialties */}
        {helper.specialties?.length > 0 && (
          <HStack spacing={2} flexWrap="wrap" mb={4}>
            {helper.specialties.map((s, i) => (
              <Badge key={i} bg="navy.600" color="white" borderRadius="full" px={3} py={1} fontSize="xs">
                {s}
              </Badge>
            ))}
          </HStack>
        )}

        {/* Cost breakdown */}
        <Accordion allowToggle mb={4}>
          <AccordionItem border="none">
            <AccordionButton
              bg="navy.50"
              rounded="lg"
              border="1px solid"
              borderColor="navy.100"
              _hover={{ bg: "navy.100" }}
            >
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold" color="navy.600" fontSize="sm">
                  View Cost Breakdown
                </Text>
              </Box>
              <AccordionIcon color="navy.600" />
            </AccordionButton>
            <AccordionPanel pt={4} pb={2}>
              <Grid templateColumns={["1fr", "repeat(2, 1fr)"]} gap={2}>
                {[
                  [`Labor (${helper.helpers || 2} helpers × ${helper.estimatedTime})`, helper.costBreakdown?.laborCost || Math.floor(helper.price * 0.6)],
                  ["Truck Rental", helper.costBreakdown?.truckRental || Math.floor(helper.price * 0.2)],
                  [`Mileage (${helper.distance} mi)`, helper.costBreakdown?.mileageFee || Math.floor(helper.price * 0.1)],
                  ["Packing Materials", helper.costBreakdown?.packingMaterials || Math.floor(helper.price * 0.05)],
                  ["Fuel Surcharge", helper.costBreakdown?.fuelSurcharge || Math.floor(helper.price * 0.03)],
                  ["Insurance", helper.costBreakdown?.insurance || Math.floor(helper.price * 0.02)],
                ].map(([label, val]) => (
                  <HStack key={label} justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
                    <Text fontSize="sm" color="gray.600">{label}</Text>
                    <Text fontSize="sm" fontWeight="semibold">{formatCurrency(val)}</Text>
                  </HStack>
                ))}
              </Grid>
              <Divider my={3} />
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" color="gray.600">Subtotal</Text>
                <Text fontSize="sm" fontWeight="semibold">{formatCurrency(helper.costBreakdown?.subtotal || Math.floor(helper.price * 0.85))}</Text>
              </HStack>
              <HStack justify="space-between" mb={3}>
                <Text fontSize="sm" color="gray.600">Taxes</Text>
                <Text fontSize="sm" fontWeight="semibold">{formatCurrency(helper.costBreakdown?.taxes || Math.floor(helper.price * 0.15))}</Text>
              </HStack>
              <HStack justify="space-between" bg="brand.50" border="1px solid" borderColor="brand.200" p={3} rounded="lg">
                <Text fontWeight="extrabold" color="navy.600">Total</Text>
                <Text fontWeight="extrabold" fontSize="lg" color="brand.600">
                  {formatCurrency(helper.costBreakdown?.total || helper.price)}
                </Text>
              </HStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* Book CTA */}
        <Button
          w="100%"
          size="lg"
          h="52px"
          bg={isBest ? "brand.500" : "navy.600"}
          color="white"
          fontWeight="extrabold"
          fontSize="md"
          letterSpacing="0.06em"
          borderRadius="10px"
          _hover={{
            bg: isBest ? "brand.600" : "navy.700",
            transform: "translateY(-2px)",
            shadow: "lg",
          }}
          _active={{ transform: "translateY(0)" }}
          transition="all 0.2s"
        >
          BOOK {helper.name.toUpperCase()} — {formatCurrency(helper.rate)}
        </Button>
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════ PAGE ══════════════════════════════════ */

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const route  = location.state?.route;

  return (
    <Box w="100%" minH="100vh" bg="gray.50" overflowX="hidden">
      <Navbar />

      {/* Page top padding for fixed nav */}
      <Box pt="92px">

        {/* ── Page header band ── */}
        <Box bg="navy.600" py={8} px={[4, 6]}>
          <Flex maxW="1000px" mx="auto" align="center" gap={4}>
            <Box bg="brand.500" p={3} borderRadius="xl">
              <Icon as={FaTruckMoving} color="white" boxSize={7} />
            </Box>
            <VStack align="start" spacing={0}>
              <Heading
                as="h1"
                fontSize={["2xl", "3xl"]}
                fontWeight="extrabold"
                color="white"
                lineHeight="1.1"
              >
                YOUR MOVING QUOTES
              </Heading>
              <Text color="whiteAlpha.800" fontSize="sm">
                Compare movers and book your best deal
              </Text>
            </VStack>
          </Flex>
        </Box>

        <Box maxW="1000px" mx="auto" px={[4, 6]} py={8}>

          {result && result.length > 0 ? (
            <>
              {/* ── Quick summary ── */}
              <Flex gap={4} mb={8} direction={["column", "row"]}>
                <StatCard icon={FaRoute}      label="Distance"   value={`${result[0].distance} mi`} />
                <StatCard icon={FaClock}      label="Est. Time"  value={`${result[0].estimatedTime} hrs`} />
                <StatCard icon={FaTruckMoving} label="Best Price" value={formatCurrency(Math.min(...result.map(h => h.rate)))} valueColor="brand.500" />
                <StatCard icon={FaShieldAlt}  label="Movers"     value={`${result.length} available`} />
              </Flex>

              {/* ── Map ── */}
              <Box mb={8} rounded="2xl" overflow="hidden" shadow="md" border="2px solid" borderColor="gray.200">
                <Box bg="navy.600" px={5} py={3}>
                  <HStack>
                    <Icon as={FaRoute} color="brand.400" boxSize={4} />
                    <Text color="white" fontWeight="extrabold" fontSize="sm" letterSpacing="wide">
                      ROUTE MAP
                    </Text>
                  </HStack>
                </Box>
                <USAMap routeCoordinates={route} />
              </Box>

              {/* ── Quote cards ── */}
              <VStack spacing={6} align="stretch">
                {result.map((helper, index) => (
                  <HelperCard key={helper.id} helper={helper} index={index} />
                ))}
              </VStack>
            </>
          ) : (
            <VStack spacing={4} textAlign="center" py={16}>
              <Icon as={FaTruckMoving} boxSize={16} color="gray.300" />
              <Text color="gray.500" fontSize="lg" fontWeight="semibold">
                No results found.
              </Text>
              <Text color="gray.400" fontSize="sm">
                Please return to the main page and try again.
              </Text>
            </VStack>
          )}

          {/* ── New quote CTA ── */}
          <Button
            mt={8}
            w="100%"
            size="lg"
            h="56px"
            bg="navy.600"
            color="white"
            fontWeight="extrabold"
            fontSize="lg"
            letterSpacing="0.06em"
            borderRadius="12px"
            leftIcon={<Icon as={FaArrowLeft} />}
            _hover={{ bg: "navy.700", transform: "translateY(-2px)", shadow: "lg" }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            onClick={() => navigate("/")}
          >
            GET A NEW QUOTE
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResultPage;
