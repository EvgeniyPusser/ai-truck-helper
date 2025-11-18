import React from "react";
import { 
  Box, 
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon
} from "@chakra-ui/react";
import { FaTruckMoving, FaClock, FaRoute, FaStar, FaPhone, FaCheck, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import USAMap from '../components/USAMap';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;

  return (
    <Box minH="100vh" w="100vw" bgGradient="linear(to-br, blue.700, blue.400, blue.100)" display="flex" flexDirection="column" justifyContent="center" alignItems="center" px={0}>
      <Box w="100%" maxW="1000px" bg="white" p={[6,8]} rounded="3xl" shadow="2xl" display="flex" flexDirection="column" alignItems="center" justifyContent="center" borderWidth="4px" borderStyle="solid" borderColor="blue.300" mt={[0,4]} mx={4}>
        <Heading size="2xl" color="blue.700" mb={4} textAlign="center" textShadow="0 2px 16px #0002">Your Moving Quotes</Heading>
        
        {result && result.length > 0 ? (
          <>
            {/* Quick Summary */}
            <Box w="100%" bg="blue.50" p={6} rounded="xl" mb={6} border="2px solid" borderColor="blue.200">
              <Grid templateColumns={["1fr", "repeat(3, 1fr)"]} gap={4} textAlign="center">
                <GridItem>
                  <HStack justify="center" mb={2}>
                    <Icon as={FaRoute} color="blue.600" />
                    <Text fontSize="lg" fontWeight="bold" color="blue.700">Distance</Text>
                  </HStack>
                  <Text fontSize="xl" color="blue.800">{result[0].distance} miles</Text>
                </GridItem>
                <GridItem>
                  <HStack justify="center" mb={2}>
                    <Icon as={FaClock} color="blue.600" />
                    <Text fontSize="lg" fontWeight="bold" color="blue.700">Est. Time</Text>
                  </HStack>
                  <Text fontSize="xl" color="blue.800">{result[0].estimatedTime} hours</Text>
                </GridItem>
                <GridItem>
                  <HStack justify="center" mb={2}>
                    <Icon as={FaTruckMoving} color="blue.600" />
                    <Text fontSize="lg" fontWeight="bold" color="blue.700">Best Price</Text>
                  </HStack>
                  <Text fontSize="2xl" color="green.600" fontWeight="bold">{formatCurrency(Math.min(...result.map(h => h.rate)))}</Text>
                </GridItem>
              </Grid>
            </Box>

            {/* Route Map */}
            <Box w="100%" mb={6}>
              <USAMap zipMarkers={result.map(h => h.zipCoords).filter(Boolean)} />
            </Box>

            {/* Detailed Quotes */}
            <VStack spacing={6} align="stretch" w="100%">
              {result.map((helper, index) => (
                <Box key={helper.id} bg={index === 0 ? "green.50" : "gray.50"} p={6} rounded="xl" shadow="md" border="2px solid" borderColor={index === 0 ? "green.200" : "gray.200"} position="relative">
                  {index === 0 && (
                    <Badge colorScheme="green" position="absolute" top={-2} right={4} px={3} py={1} fontSize="sm">
                      BEST VALUE
                    </Badge>
                  )}
                  
                  {/* Header */}
                  <Grid templateColumns={["1fr", "2fr 1fr"]} gap={4} mb={4}>
                    <GridItem>
                      <HStack mb={2}>
                        <Icon as={FaTruckMoving} boxSize={6} color="blue.500" />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xl" fontWeight="bold" color="blue.800">{helper.name}</Text>
                          <HStack>
                            <Text fontSize="sm" color="gray.600">{helper.source}</Text>
                            <HStack spacing={1}>
                              <Icon as={FaStar} color="yellow.400" boxSize={3} />
                              <Text fontSize="sm" color="gray.600">{helper.rating}</Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">• {helper.experience}</Text>
                          </HStack>
                        </VStack>
                      </HStack>
                      
                      <HStack mb={3}>
                        <Icon as={FaPhone} color="green.500" boxSize={4} />
                        <Text color="green.600" fontWeight="medium">{helper.phone}</Text>
                        <Badge colorScheme={helper.availability === "Available Today" ? "green" : "blue"} variant="subtle">
                          {helper.availability}
                        </Badge>
                      </HStack>
                    </GridItem>
                    
                    <GridItem textAlign={["left", "right"]}>
                      <Text fontSize="3xl" fontWeight="bold" color="green.600" mb={1}>
                        {formatCurrency(helper.rate)}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        ${helper.hourlyRate}/hr • {helper.helperCount} helpers
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Est. {helper.estimatedTime} hours total
                      </Text>
                    </GridItem>
                  </Grid>

                  {/* Truck Info */}
                  <Box bg="white" p={4} rounded="lg" mb={4}>
                    <Text fontSize="lg" fontWeight="semibold" mb={2} color="blue.700">🚚 Truck: {helper.truck.name}</Text>
                    <Grid templateColumns={["1fr", "repeat(3, 1fr)"]} gap={3}>
                      <Text fontSize="sm" color="gray.600">Volume: {helper.truck.volume_m3} m³</Text>
                      <Text fontSize="sm" color="gray.600">Max Weight: {helper.truck.max_weight_kg} kg</Text>
                      <Text fontSize="sm" color="gray.600">${helper.truck.dailyRate}/day + ${helper.truck.mileageRate}/mi</Text>
                    </Grid>
                    <Text fontSize="sm" color="gray.600" mt={2}>{helper.truck.description}</Text>
                  </Box>

                  {/* Services */}
                  <Box bg="white" p={4} rounded="lg" mb={4}>
                    <Text fontSize="lg" fontWeight="semibold" mb={3} color="blue.700">Services Included</Text>
                    <Grid templateColumns={["1fr", "repeat(2, 1fr)"]} gap={2}>
                      <HStack>
                        <Icon as={helper.services.packing ? FaCheck : FaTimes} color={helper.services.packing ? "green.500" : "red.500"} />
                        <Text fontSize="sm">Packing Service</Text>
                      </HStack>
                      <HStack>
                        <Icon as={helper.services.unpacking ? FaCheck : FaTimes} color={helper.services.unpacking ? "green.500" : "red.500"} />
                        <Text fontSize="sm">Unpacking Service</Text>
                      </HStack>
                      <HStack>
                        <Icon as={helper.services.furniture_assembly ? FaCheck : FaTimes} color={helper.services.furniture_assembly ? "green.500" : "red.500"} />
                        <Text fontSize="sm">Furniture Assembly</Text>
                      </HStack>
                      <HStack>
                        <Icon as={helper.services.storage ? FaCheck : FaTimes} color={helper.services.storage ? "green.500" : "red.500"} />
                        <Text fontSize="sm">Storage Available</Text>
                      </HStack>
                    </Grid>
                  </Box>

                  {/* Specialties */}
                  <Box bg="white" p={4} rounded="lg" mb={4}>
                    <Text fontSize="lg" fontWeight="semibold" mb={2} color="blue.700">Specialties</Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {helper.specialties.map((specialty, idx) => (
                        <Badge key={idx} colorScheme="blue" variant="subtle">{specialty}</Badge>
                      ))}
                    </HStack>
                  </Box>

                  {/* Cost Breakdown */}
                  <Accordion allowToggle>
                    <AccordionItem border="none">
                      <AccordionButton bg="blue.100" rounded="lg" _hover={{ bg: "blue.200" }}>
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="medium" color="blue.800">View Cost Breakdown</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4} pt={4}>
                        <Grid templateColumns={["1fr", "repeat(2, 1fr)"]} gap={3}>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Labor ({helper.helperCount} helpers × {helper.estimatedTime}h)</Text>
                            <Text fontSize="sm" fontWeight="medium">{formatCurrency(helper.costBreakdown.laborCost)}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Truck Rental</Text>
                            <Text fontSize="sm" fontWeight="medium">{formatCurrency(helper.costBreakdown.truckRental)}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Mileage ({helper.distance} mi)</Text>
                            <Text fontSize="sm" fontWeight="medium">{formatCurrency(helper.costBreakdown.mileageFee)}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Packing Materials</Text>
                            <Text fontSize="sm" fontWeight="medium">{formatCurrency(helper.costBreakdown.packingMaterials)}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Fuel Surcharge</Text>
                            <Text fontSize="sm" fontWeight="medium">{formatCurrency(helper.costBreakdown.fuelSurcharge)}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Insurance</Text>
                            <Text fontSize="sm" fontWeight="medium">{formatCurrency(helper.costBreakdown.insurance)}</Text>
                          </HStack>
                        </Grid>
                        <Divider my={3} />
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="sm">Subtotal</Text>
                          <Text fontSize="sm" fontWeight="medium">{formatCurrency(helper.costBreakdown.subtotal)}</Text>
                        </HStack>
                        <HStack justify="space-between" mb={3}>
                          <Text fontSize="sm">Taxes</Text>
                          <Text fontSize="sm" fontWeight="medium">{formatCurrency(helper.costBreakdown.taxes)}</Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="green.50" rounded="lg">
                          <Text fontSize="lg" fontWeight="bold">Total</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.600">{formatCurrency(helper.costBreakdown.total)}</Text>
                        </HStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>

                  {/* Action Button */}
                  <Button 
                    colorScheme={index === 0 ? "green" : "blue"} 
                    size="lg" 
                    w="100%" 
                    mt={4}
                    _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
                  >
                    Book {helper.name} - {formatCurrency(helper.rate)}
                  </Button>
                </Box>
              ))}
            </VStack>
          </>
        ) : (
          <Text color="red.500" textAlign="center" fontSize="lg">No result data. Please return to the main page and try again.</Text>
        )}
        
        <Button colorScheme="yellow" mt={6} w="100%" size="lg" fontWeight="bold" fontSize="xl" onClick={() => navigate("/")}>
          Get New Quote
        </Button>
      </Box>
    </Box>
  );
};

export default ResultPage;
