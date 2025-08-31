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
                    <li key={h.id}>
                      {h.name}: <strong>${h.rate}</strong>
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
