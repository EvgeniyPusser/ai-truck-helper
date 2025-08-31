// ...existing code...
import React from "react";
import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  return (
    <Box minH="100vh" bg="gray.50" py={12} px={4}>
      <VStack spacing={8} align="center">
        <Heading size="2xl" color="blue.700">Your Moving Quote</Heading>
        {result ? (
          <Box bg="white" p={6} rounded="md" shadow="md" maxW="600px" w="100%">
            <Heading size="md" mb={2}>Price Details</Heading>
            {Array.isArray(result) && result.length > 0 ? (
              <>
                <Text fontSize="lg" color="blue.700" mb={2}>
                  Estimated price: <strong>${result[0].rate}</strong>
                </Text>
                <Text fontSize="md" color="gray.700" mb={2}>All offers:</Text>
                <ul style={{margin:0, paddingLeft:20}}>
                  {result.map((h) => (
                    <li key={h.id} style={{marginBottom: "1em"}}>
                      <div>
                        <strong>{h.name}</strong>: ${h.rate}
                      </div>
                      {h.truck && (
                        <Box bg="gray.50" p={3} rounded="md" mt={1} mb={1}>
                          <Text fontSize="sm" color="gray.800">
                            <strong>Truck:</strong> {h.truck.name} ({h.truck.volume_m3} m³, max {h.truck.max_weight_kg} kg)
                          </Text>
                          <Text fontSize="sm" color="gray.600" mt={1}>
                            {h.truck.description}
                          </Text>
                        </Box>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(result, null, 2)}</pre>
            )}
          </Box>
        ) : (
          <Text color="red.500">No result data. Please return to the main page and try again.</Text>
        )}
        <Button colorScheme="blue" onClick={() => navigate("/")}>Back to Main</Button>
      </VStack>
    </Box>
  );
};

export default ResultPage;
