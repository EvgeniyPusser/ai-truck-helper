import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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

        // Первый запрос: расчет
        const res = await fetch(`${apiUrl}/api/helpers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error(await parseError(res));
        }

        const data = await res.json();

        // Второй запрос: маршрут
        // Пример: координаты должны быть в formData.pickupLng, pickupLat, dropoffLng, dropoffLat
        // Если у вас другие поля, замените их ниже
        const routeRes = await fetch(`${apiUrl}/api/maps/route`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates: [
              [formData.pickupLng, formData.pickupLat],
              [formData.dropoffLng, formData.dropoffLat],
            ],
            profile: "driving-car",
          }),
        });

        let routeData = null;
        if (routeRes.ok) {
          routeData = await routeRes.json();
        } else {
          routeData = { error: await routeRes.text() };
        }

        // Сохраняем оба результата
        setResult({ offers: data, route: routeData.route });

        // переход на страницу результата с передачей данных
        navigate("/result", { state: { offers: data, route: routeData.route } });
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
                {/* Выводим предложения */}
                {result.offers && Array.isArray(result.offers) && result.offers.length > 0 ? (
                  <>
                    <Text fontSize="lg" color="blue.700" mb={2}>
                      Цена для клиента: <strong>${result.offers[0].rate}</strong>
                    </Text>
                    <Text fontSize="md" color="gray.700" mb={2}>
                      Все предложения:
                    </Text>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {result.offers.map((h) => (
                        <li key={h.id ?? h.name}>
                          {h.name}: <strong>${h.rate}</strong>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                    {JSON.stringify(result.offers, null, 2)}
                  </pre>
                )}
                {/* Визуализация маршрута на карте */}
                <Heading size="sm" mt={4} mb={2} color="teal.700">
                  Маршрут на карте
                </Heading>
                {result.route && Array.isArray(result.route) && result.route.length > 1 ? (
                  <Box w="100%" h="300px" mb={2}>
                    <MapContainer
                      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
                      center={result.route[0]}
                      zoom={7}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      <Polyline positions={result.route} color="blue" weight={5} />
                      <Marker position={result.route[0]}>
                        <Popup>Start</Popup>
                      </Marker>
                      <Marker position={result.route[result.route.length - 1]}>
                        <Popup>End</Popup>
                      </Marker>
                    </MapContainer>
                  </Box>
                ) : (
                  <Text color="red.500">Нет данных маршрута</Text>
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
