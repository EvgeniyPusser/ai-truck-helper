import React from "react";
import { Box, Heading, Text, VStack, Button, Icon } from "@chakra-ui/react";
import { FaTruckMoving } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import USAMap from '../components/USAMap';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  return (
    <Box minH="100vh" w="100vw" bgGradient="linear(to-br, blue.700, blue.400, blue.100)" display="flex" flexDirection="column" justifyContent="center" alignItems="center" px={0}>
      <Box w="100%" maxW="700px" bg="white" p={[6,8]} rounded="3xl" shadow="2xl" display="flex" flexDirection="column" alignItems="center" justifyContent="center" borderWidth="4px" borderStyle="solid" borderColor="blue.300" mt={[0,4]}>
        <Heading size="2xl" color="blue.700" mb={4} textAlign="center" textShadow="0 2px 16px #0002">Your Moving Quote</Heading>
        {result ? (
          <>
            <Text fontSize={["xl","2xl"]} color="blue.800" mb={4} textAlign="center" fontWeight="bold" letterSpacing="wide">
              Estimated price: <span style={{color:'#2B6CB0'}}>${result[0].rate}</span>
            </Text>
            {/* Карта США с маркерами ZIP (можно передать массив координат) */}
            <Box w="100%" mb={6}>
              <USAMap zipMarkers={result.map(h => h.zipCoords).filter(Boolean)} />
            </Box>
            {Array.isArray(result) && result.length > 0 && (
              <Box w="100%" mt={2}>
                <Text fontSize="lg" color="blue.600" mb={3} textAlign="center" fontWeight="semibold">All offers:</Text>
                <VStack spacing={4} align="stretch" maxH="40vh" overflowY="auto">
                  {result.map((h) => (
                    <Box key={h.id} bgGradient="linear(to-r, blue.50, blue.100)" p={4} rounded="xl" shadow="md" display="flex" alignItems="center">
                      <Icon as={FaTruckMoving} boxSize={8} color="blue.400" mr={4} />
                      <Box flex="1">
                        <Text fontSize="lg" color="blue.800" fontWeight="bold">{h.name}: <span style={{fontWeight:'normal'}}>${h.rate}</span></Text>
                        {h.truck && (
                          <Text fontSize="sm" color="gray.800" mt={1}>
                            <strong>Truck:</strong> {h.truck.name} ({h.truck.volume_m3} m³, max {h.truck.max_weight_kg} kg)
                          </Text>
                        )}
                        {h.truck?.description && (
                          <Text fontSize="sm" color="gray.600" mt={1}>{h.truck.description}</Text>
                        )}
                      </Box>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </>
        ) : (
          <Text color="red.500" textAlign="center" fontSize="lg">No result data. Please return to the main page and try again.</Text>
        )}
        <Button colorScheme="yellow" mt={6} w="100%" size="lg" fontWeight="bold" fontSize="xl" onClick={() => navigate("/")}>Back to Main</Button>
      </Box>
    </Box>
  );
};

export default ResultPage;
