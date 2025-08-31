import React, { useState, useEffect, useCallback } from "react";
import { Box, VStack, Image, Heading, Text, Button } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import MoveForm from "../components/MoveForm";
import dwarfImg from "../assets/myDwarf.png";
import { health } from "../api/health";

const LandingPage = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Пинг "жив ли сервер"
  useEffect(() => {
    const ac = new AbortController();
    health({ signal: ac.signal })
      .then((r) => console.log("health:", r))
      .catch((e) => {
        // Игнорируем AbortError при размонтаже
        if (e?.name !== "AbortError") console.error("health error:", e);
      });
    return () => ac.abort();
  }, []);

  // Базовый URL API: env → origin → localhost
  const apiUrl = (
    import.meta.env.VITE_API_URL ||
    (typeof window !== "undefined" ? window.location.origin : "") ||
    "http://localhost:3001"
  ).replace(/\/+$/, ""); // убираем хвостовые слеши

  const parseError = async (res) => {
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const j = await res.json();
        // пытаемся вытащить человеко-понятное сообщение
        const msg =
          j?.message ||
          j?.error ||
          (typeof j === "string" ? j : JSON.stringify(j, null, 2));
        return `POST /api/helpers → ${res.status}. ${msg}`;
      }
      const t = await res.text();
      return `POST /api/helpers → ${res.status}. ${t}`;
    } catch {
      return `POST /api/helpers → ${res.status}. (failed to read error body)`;
    }
  };

  const handleSubmit = useCallback(
    async (formData) => {
      if (isSubmitting) return; // защита от дабл-кликов
      setIsSubmitting(true);
      try {
        setError("");
        setResult(null);

        const res = await fetch(`${apiUrl}/api/helpers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error(await parseError(res));
        }

        const data = await res.json();
        setResult(data);

        // переход на страницу результата с передачей данных
        navigate("/result", { state: { result: data } });
      } catch (e) {
        console.error(e);
        setError(e.message || "Request failed");
      } finally {
        setIsSubmitting(false);
      }
    },
    [apiUrl, isSubmitting, navigate]
  );

  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, white)" px={0}>
      {/* Hero */}
      <Box
        w="100%"
        minH="100vh"
        bg="blue.600"
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
          <Image
            src={dwarfImg}
            alt="Gnome Mascot"
            boxSize={["120px", "180px", "220px"]}
            mb={2}
            shadow="2xl"
            borderRadius="full"
            border="4px solid white"
          />
          <Heading
            size={["lg", "2xl", "3xl"]}
            color="white"
            textShadow="0 2px 8px #0004"
            textAlign="center"
          >
            HolyMove LA
          </Heading>
          <Text
            fontSize={["md", "xl", "2xl"]}
            color="whiteAlpha.900"
            maxW={["90vw", "600px"]}
            textAlign="center"
            fontWeight="medium"
          >
            Fast, reliable moving service for any apartment size.<br />
            Enter your ZIP, number of rooms, date, and baggage details — get
            instant price, route, truck info, and more!
          </Text>

          <Box
            w="100%"
            maxW={["95vw", "500px"]}
            bg="white"
            p={[3, 5, 7]}
            rounded="2xl"
            shadow="xl"
            mt={2}
          >
            {/* Если MoveForm поддерживает disabled/isLoading — передай пропсы внутрь */}
            <MoveForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

            {error && (
              <Box
                bg="red.50"
                border="1px solid #fca5a5"
                color="red.700"
                p={3}
                rounded="md"
                mt={3}
                fontSize={["sm", "md"]}
              >
                {error}
                <br />
                <strong>Подсказка:</strong> если это 404 — на бэке нет роута{" "}
                <code>POST /api/helpers</code>. Если это CORS (в консоли
                <code>No 'Access-Control-Allow-Origin'</code>), проверь заголовки
                на сервере и домен в <code>VITE_API_URL</code>.
              </Box>
            )}

            {result && (
              <Box bg="gray.50" p={4} rounded="md" shadow="md" mt={3}>
                <Heading size="md" mb={2}>
                  Result
                </Heading>
                {Array.isArray(result) && result.length > 0 ? (
                  <>
                    <Text fontSize="lg" color="blue.700" mb={2}>
                      Цена для клиента: <strong>${result[0].rate}</strong>
                    </Text>
                    <Text fontSize="md" color="gray.700" mb={2}>
                      Все предложения:
                    </Text>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {result.map((h) => (
                        <li key={h.id ?? h.name}>
                          {h.name}: <strong>${h.rate}</strong>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Benefits */}
      <Box maxW="900px" mx="auto" mt={[4, 8, 12]} mb={[4, 8, 12]} px={[2, 4, 0]}>
        <Heading
          size={["md", "lg"]}
          color="blue.700"
          mb={[4, 6]}
          textAlign="center"
        >
          Why Choose HolyMove?
        </Heading>
        <VStack spacing={[4, 6, 8]} align="stretch">
          <Box
            bg="white"
            p={[4, 6]}
            rounded="xl"
            shadow="md"
            display="flex"
            flexDirection={["column", "row"]}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize={["lg", "xl"]} color="blue.600" fontWeight="bold">
              Instant Quote
            </Text>
            <Text fontSize={["sm", "md"]} color="gray.600" maxW={["100%", "400px"]}>
              Get your moving price in seconds — no calls, no waiting.
            </Text>
          </Box>

          <Box
            bg="white"
            p={[4, 6]}
            rounded="xl"
            shadow="md"
            display="flex"
            flexDirection={["column", "row"]}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize={["lg", "xl"]} color="blue.600" fontWeight="bold">
              Smart Truck Selection
            </Text>
            <Text fontSize={["sm", "md"]} color="gray.600" maxW={["100%", "400px"]}>
              We pick the right truck for your move, based on rooms, volume, and weight.
            </Text>
          </Box>

          <Box
            bg="white"
            p={[4, 6]}
            rounded="xl"
            shadow="md"
            display="flex"
            flexDirection={["column", "row"]}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize={["lg", "xl"]} color="blue.600" fontWeight="bold">
              Trusted Helpers
            </Text>
            <Text fontSize={["sm", "md"]} color="gray.600" maxW={["100%", "400px"]}>
              All helpers are verified, friendly, and ready to assist.
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Call to Action */}
      <Box bg="blue.50" py={[6, 8, 12]}>
        <VStack spacing={[2, 4]} align="center">
          <Heading size={["sm", "md"]} color="blue.700">
            Are you a helper, company, truck owner, driver, or agent?
          </Heading>
          <VStack spacing={[1, 2]}>
            <Button
              as={RouterLink}
              to="/helper"
              colorScheme="green"
              variant="solid"
              size={["sm", "md"]}
              isDisabled={isSubmitting}
            >
              Become a Helper
            </Button>
            <Button
              as={RouterLink}
              to="/company"
              colorScheme="purple"
              variant="solid"
              size={["sm", "md"]}
              isDisabled={isSubmitting}
            >
              For Companies
            </Button>
            <Button
              as={RouterLink}
              to="/truck"
              colorScheme="orange"
              variant="solid"
              size={["sm", "md"]}
              isDisabled={isSubmitting}
            >
              Truck Owners
            </Button>
            <Button
              as={RouterLink}
              to="/driver"
              colorScheme="teal"
              variant="solid"
              size={["sm", "md"]}
              isDisabled={isSubmitting}
            >
              Drivers
            </Button>
            <Button
              as={RouterLink}
              to="/agent"
              colorScheme="pink"
              variant="solid"
              size={["sm", "md"]}
              isDisabled={isSubmitting}
            >
              Agents
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default LandingPage;
