
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
      navigate("/result", { state: { result: data } });
    } catch (e) {
      console.error(e);
      setError(e.message || "Request failed");
    }
  };


  return (
    <>
      {/* Promo code banner */}
      <Box w="100vw" bg="yellow.300" py={1} textAlign="center" fontWeight="semibold" fontSize="xs" letterSpacing="wide" position="fixed" top={0} left={0} zIndex={10} borderBottom="1px solid #ECC94B">
        USE COUPON CODE <span style={{color:'#2B6CB0'}}>#ONESHOTMOVEFOR3</span> FOR 3 FREE BOXES!
      </Box>
      {/* Hero Section - covers full width */}
      <Box
        w="100vw"
        minH="100vh"
        bgGradient="linear(to-br, blue.700, blue.400)"
        position="relative"
        px={0}
        pt={[6,8,10]}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        {/* Decorative circle background */}
        <Box position="absolute" right={-40} top={-40} w={["180px","300px","400px"]} h={["180px","300px","400px"]} bg="whiteAlpha.200" borderRadius="full" zIndex={0} />
        <Box
          position="relative"
          w="100vw"
          minH="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flex="1"
          zIndex={1}
        >
          <Image src={dwarfImg} alt="Gnome Mascot" boxSize={["120px", "180px", "220px"]} mb={2} shadow="2xl" borderRadius="full" border="4px solid white" />
          <Text fontSize={["lg", "2xl", "3xl"]} color="whiteAlpha.900" maxW={["90vw", "600px"]} textAlign="center" fontWeight="bold" mb={4}>
            INSTANT QUOTE
          </Text>
          <Text fontSize={["md", "xl", "2xl"]} color="whiteAlpha.900" maxW={["90vw", "600px"]} textAlign="center" fontWeight="medium" mb={4}>
            Fast, reliable moving service for any apartment size.<br />
            Enter your ZIP, number of rooms, date, and baggage details — get instant price, route, truck info, and more!
          </Text>
          <Box w="100vw" maxW={["100vw","700px","900px"]} bg="white" p={[4, 8, 12]} rounded="2xl" shadow="2xl" mt={2}>
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
                <Heading size="md" mb={2}>Quick Preview</Heading>
                {Array.isArray(result) && result.length > 0 ? (
                  <>
                    <Text fontSize="lg" color="blue.700" mb={2}>
                      Best Price: <strong>${Math.min(...result.map(h => h.rate)).toLocaleString()}</strong>
                    </Text>
                    <Text fontSize="md" color="gray.700" mb={2}>
                      Distance: {result[0].distance} miles • Time: {result[0].estimatedTime} hours
                    </Text>
                    <Text fontSize="md" color="gray.700" mb={3}>Available movers:</Text>
                    <ul style={{margin:0, paddingLeft:20}}>
                      {result.map((h) => (
                        <li key={h.id}>
                          <strong>{h.name}</strong>: ${h.rate.toLocaleString()} 
                          <span style={{color: '#666', fontSize: '12px'}}> • {h.rating}⭐ • {h.source}</span>
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
    </>
  );
};

export default LandingPage;

