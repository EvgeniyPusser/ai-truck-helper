import React, { useState } from "react";
import { Box, VStack, Image, Heading, Text, Button } from "@chakra-ui/react";
import MoveForm from "../components/MoveForm";
import dwarfImg from "../assets/dwarf.png";

const LandingPage = () => {
  const [result, setResult] = useState(null);
  const handleSubmit = async (formData) => {
    // Отправка запроса на сервер
    const res = await fetch("/api/helpers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12} px={4}>
      <VStack spacing={8} align="center">
        <Image src={dwarfImg} alt="Dwarf Mascot" boxSize="120px" mb={2} />
        <Heading size="2xl" color="blue.700">HolyMove LA</Heading>
        <Text fontSize="xl" color="gray.700" maxW="600px" textAlign="center">
          Fast, reliable moving service for any apartment size. Enter your ZIP, number of rooms, date, and baggage details — get instant price, route, truck info, and more!
        </Text>
        <MoveForm onSubmit={handleSubmit} />
        {result && (
          <Box bg="white" p={6} rounded="md" shadow="md" mt={8} maxW="600px">
            <Heading size="md" mb={2}>Result</Heading>
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
          </Box>
        )}
        <Text fontSize="md" color="gray.500" mt={8}>
          Are you a helper, company, truck owner, driver, or agent?
        </Text>
        <Button colorScheme="green" variant="outline" size="md" as="a" href="/helper">Become a Helper</Button>
        <Button colorScheme="purple" variant="outline" size="md" as="a" href="/company">For Companies</Button>
        <Button colorScheme="orange" variant="outline" size="md" as="a" href="/truck">Truck Owners</Button>
        <Button colorScheme="teal" variant="outline" size="md" as="a" href="/driver">Drivers</Button>
        <Button colorScheme="pink" variant="outline" size="md" as="a" href="/agent">Agents</Button>
      </VStack>
    </Box>
  );
};

export default LandingPage;
