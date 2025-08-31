import React, { useState, useEffect } from "react";
import { Box, VStack, Image, Heading, Text, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import MoveForm from "../components/MoveForm";
import dwarfImg from "../assets/myDwarf.png";
import { health } from "../api/health";

const LandingPage = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // проверка, что сервер жив
  useEffect(() => {
    health()
      .then((r) => console.log("health:", r))
      .catch((e) => console.error("health error:", e));
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setError("");
      setResult(null);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/api/helpers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        // покажем понятную ошибку, если роут отсутствует (404) или другая проблема
        const text = await res.text();
        throw new Error(`POST /api/helpers → ${res.status}. ${text}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setError(e.message || "Request failed");
    }
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

        {error && (
          <Box bg="red.50" border="1px solid #fca5a5" color="red.700" p={4} rounded="md" maxW="600px">
            {error}
            <br />
            <strong>Подсказка:</strong> если это 404 — на бэке нет роута <code>POST /api/helpers</code>.
          </Box>
        )}

        {result && (
          <Box bg="white" p={6} rounded="md" shadow="md" mt={2} maxW="600px" w="100%">
            <Heading size="md" mb={2}>Result</Heading>
            {Array.isArray(result) && result.length > 0 ? (
              <>
                <Text fontSize="lg" color="blue.700" mb={2}>
                  Цена для клиента: <strong>${result[0].rate}</strong>
                </Text>
                <Text fontSize="md" color="gray.700" mb={2}>Все предложения:</Text>
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
        )}

        <Text fontSize="md" color="gray.500" mt={6}>
          Are you a helper, company, truck owner, driver, or agent?
        </Text>

        {/* Используем RouterLink вместо href, чтобы не перезагружать страницу */}
        <VStack spacing={2}>
          <Button as={RouterLink} to="/helper" colorScheme="green" variant="outline" size="md">Become a Helper</Button>
          <Button as={RouterLink} to="/company" colorScheme="purple" variant="outline" size="md">For Companies</Button>
          <Button as={RouterLink} to="/truck" colorScheme="orange" variant="outline" size="md">Truck Owners</Button>
          <Button as={RouterLink} to="/driver" colorScheme="teal" variant="outline" size="md">Drivers</Button>
          <Button as={RouterLink} to="/agent" colorScheme="pink" variant="outline" size="md">Agents</Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default LandingPage;

