import React, { useState, useEffect } from "react";
import { Box, VStack, Image, Heading, Text, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MoveForm from "../components/MoveForm";
import dwarfImg from "../assets/myDwarf.png";
import { health } from "../api/health";

const LandingPage = () => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
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
        const text = await res.text();
        throw new Error(`POST /api/helpers → ${res.status}. ${text}`);
      }

      const data = await res.json();
      setResult(data);
      // переход на страницу результата с передачей данных
      navigate("/result", { state: { result: data } });
    } catch (e) {
      console.error(e);
      setError(e.message || "Request failed");
    }
  };



  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, white)" px={0}>
      {/* Hero Section - fills most of the screen on all devices */}
      <Box
        w="100%"
        minH="100vh"
        bgGradient="linear(to-r, blue.700, blue.400, blue.100)"
        px={[2, 6, 12]}
        borderBottomRadius={["2xl", "3xl"]}
        shadow="lg"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          maxW="900px"
          w="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Image src={dwarfImg} alt="Gnome Mascot" boxSize={["120px", "180px", "220px"]} mb={2} shadow="2xl" borderRadius="full" border="4px solid white" />
          <Heading size={['lg','2xl','3xl']} color="white" textShadow="0 2px 8px #0004" textAlign="center">HolyMove LA</Heading>
          <Text fontSize={["md", "xl", "2xl"]} color="whiteAlpha.900" maxW={["90vw", "600px"]} textAlign="center" fontWeight="medium">
            Fast, reliable moving service for any apartment size.<br />
            Enter your ZIP, number of rooms, date, and baggage details — get instant price, route, truck info, and more!
          </Text>
          <Box w="100%" maxW={["95vw", "500px"]} bg="white" p={[3, 5, 7]} rounded="2xl" shadow="xl" mt={2}>
            <MoveForm onSubmit={handleSubmit} />
            {error && (
              <Box bg="red.50" border="1px solid #fca5a5" color="red.700" p={3} rounded="md" mt={3} fontSize={["sm","md"]}>
                {error}
                <br />
                <strong>Подсказка:</strong> если это 404 — на бэке нет роута <code>POST /api/helpers</code>.
              </Box>
            )}
            {result && (
              <Box bg="gray.50" p={4} rounded="md" shadow="md" mt={3}>
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
          </Box>
        </Box>
      </Box>

      {/* Benefits Section - responsive and visually balanced */}
      <Box maxW="900px" mx="auto" mt={[4, 8, 12]} mb={[4, 8, 12]} px={[2, 4, 0]}>
        <Heading size={['md','lg']} color="blue.700" mb={[4,6]} textAlign="center">Why Choose HolyMove?</Heading>
        <VStack spacing={[4,6,8]} align="stretch">
          <Box bg="white" p={[4,6]} rounded="xl" shadow="md" display="flex" flexDirection={["column", "row"]} alignItems="center" justifyContent="space-between">
            <Text fontSize={["lg","xl"]} color="blue.600" fontWeight="bold">Instant Quote</Text>
            <Text fontSize={["sm","md"]} color="gray.600" maxW={["100%","400px"]}>Get your moving price in seconds — no calls, no waiting.</Text>
          </Box>
          <Box bg="white" p={[4,6]} rounded="xl" shadow="md" display="flex" flexDirection={["column", "row"]} alignItems="center" justifyContent="space-between">
            <Text fontSize={["lg","xl"]} color="blue.600" fontWeight="bold">Smart Truck Selection</Text>
            <Text fontSize={["sm","md"]} color="gray.600" maxW={["100%","400px"]}>We pick the right truck for your move, based on rooms, volume, and weight.</Text>
          </Box>
          <Box bg="white" p={[4,6]} rounded="xl" shadow="md" display="flex" flexDirection={["column", "row"]} alignItems="center" justifyContent="space-between">
            <Text fontSize={["lg","xl"]} color="blue.600" fontWeight="bold">Trusted Helpers</Text>
            <Text fontSize={["sm","md"]} color="gray.600" maxW={["100%","400px"]}>All helpers are verified, friendly, and ready to assist.</Text>
          </Box>
        </VStack>
      </Box>

      {/* Call to Action Section - responsive */}
      <Box bg="blue.50" py={[6, 8, 12]}>
        <VStack spacing={[2,4]} align="center">
          <Heading size={['sm','md']} color="blue.700">Are you a helper, company, truck owner, driver, or agent?</Heading>
          <VStack spacing={[1,2]}>
            <Button as={RouterLink} to="/helper" colorScheme="green" variant="solid" size={["sm","md"]}>Become a Helper</Button>
            <Button as={RouterLink} to="/company" colorScheme="purple" variant="solid" size={["sm","md"]}>For Companies</Button>
            <Button as={RouterLink} to="/truck" colorScheme="orange" variant="solid" size={["sm","md"]}>Truck Owners</Button>
            <Button as={RouterLink} to="/driver" colorScheme="teal" variant="solid" size={["sm","md"]}>Drivers</Button>
            <Button as={RouterLink} to="/agent" colorScheme="pink" variant="solid" size={["sm","md"]}>Agents</Button>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default LandingPage;

