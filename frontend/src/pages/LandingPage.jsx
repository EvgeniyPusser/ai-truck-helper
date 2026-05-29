import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FaArrowRight,
  FaBoxOpen,
  FaHeart,
  FaHome,
  FaTasks,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import heroImg from "../assets/newWorldHero.png";

const steps = [
  {
    icon: FaHeart,
    title: "Сначала успокаиваем дом",
    text: "Дети, питомцы, родители, бабушки и дедушки должны понимать: это не хаос, это новый маршрут для всей семьи.",
  },
  {
    icon: FaTasks,
    title: "Потом собираем план",
    text: "Что взять первым, что подписать, что отдать муверам, какие вопросы задать до того, как начались коробки.",
  },
  {
    icon: FaBoxOpen,
    title: "И только потом зовем исполнителей",
    text: "Когда вы готовы доверить подбор нам, мы попросим ZIP, дату, размер переезда и запустим текущий подбор муверов.",
  },
];

const LandingPage = () => {
  return (
    <Box w="100%" minH="100vh" bg="#fbfaf7" color="gray.900" overflowX="hidden">
      <Navbar />

      <Box
        as="main"
        position="relative"
        minH={["auto", "auto", "calc(100vh - 92px)"]}
        pt={["112px", "116px", "124px"]}
        pb={[10, 12, 16]}
        bg="#101820"
        overflow="hidden"
      >
        <Image
          src={heroImg}
          alt="A hopeful new chapter after moving"
          position="absolute"
          inset={0}
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="center"
          opacity={0.7}
        />
        <Box position="absolute" inset={0} bg="rgba(5, 9, 18, 0.58)" />
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(90deg, rgba(5,9,18,0.92) 0%, rgba(5,9,18,0.72) 45%, rgba(5,9,18,0.26) 100%)"
        />

        <Flex
          position="relative"
          zIndex={1}
          maxW="1180px"
          mx="auto"
          px={[4, 6, 8]}
          minH={["auto", "auto", "calc(100vh - 180px)"]}
          align="center"
        >
          <VStack align="start" spacing={6} maxW="690px">
            <HStack
              spacing={3}
              px={4}
              py={2}
              bg="rgba(255,255,255,0.12)"
              border="1px solid rgba(255,255,255,0.24)"
              borderRadius="full"
              color="white"
            >
              <Icon as={FaHome} color="brand.300" />
              <Text fontSize="sm" fontWeight="bold">
                Holy Move prepares the family before the movers arrive
              </Text>
            </HStack>

            <Heading
              as="h1"
              color="white"
              fontSize={["4xl", "5xl", "6xl"]}
              lineHeight="0.98"
              fontWeight="black"
            >
              Вы переезжаете?
              <Text as="span" display="block" color="brand.300">
                Катастрофа?
              </Text>
              Есть решение.
            </Heading>

            <Text color="whiteAlpha.900" fontSize={["lg", "xl"]} lineHeight="1.65" maxW="620px">
              Переезд может стать частью семейной истории. Не днем, когда
              “наш дом” развалился на коробки, а моментом, где все держатся
              вместе: дети, близкие, старшие родные, любимые вещи и новый адрес.
            </Text>

            <Text color="white" fontSize={["xl", "2xl"]} fontWeight="extrabold">
              Наш дом едет с нами. Все будет хорошо.
            </Text>

            <HStack spacing={4} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/quote"
                size="lg"
                h="56px"
                px={7}
                bg="brand.500"
                color="white"
                rightIcon={<Icon as={FaArrowRight} />}
                _hover={{ bg: "brand.600", textDecoration: "none" }}
              >
                Подберите нам муверов
              </Button>
              <Button
                as="a"
                href="#story"
                size="lg"
                h="56px"
                px={7}
                variant="outline"
                color="white"
                borderColor="whiteAlpha.700"
                _hover={{ bg: "whiteAlpha.200", textDecoration: "none" }}
              >
                Сначала подготовиться
              </Button>
            </HStack>
          </VStack>
        </Flex>
      </Box>

      <Box id="story" bg="#fbfaf7" py={[12, 16, 20]} px={[4, 6, 8]}>
        <Box maxW="1120px" mx="auto">
          <SimpleGrid columns={[1, 1, 2]} spacing={[8, 10, 14]} alignItems="center">
            <VStack align="start" spacing={5}>
              <Text color="brand.600" fontWeight="black" letterSpacing="0.08em" fontSize="sm">
                НЕ СРАЗУ ZIP. СНАЧАЛА ЧЕЛОВЕК.
              </Text>
              <Heading as="h2" fontSize={["3xl", "4xl"]} lineHeight="1.1" color="navy.700">
                Мы не начинаем с “сколько коробок”.
                Мы начинаем с “что с вами происходит”.
              </Heading>
              <Text color="gray.700" fontSize="lg" lineHeight="1.8">
                Переезд давит потому, что он выглядит как потеря контроля.
                Holy Move превращает это в последовательность: увидеть новый
                дом, собрать спокойный план, подготовить семью и только потом
                подключить исполнителей.
              </Text>
            </VStack>

            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="8px"
              p={[5, 7]}
              shadow="0 18px 50px rgba(22, 28, 45, 0.10)"
            >
              <VStack align="stretch" spacing={5}>
                {steps.map((step) => (
                  <HStack key={step.title} align="start" spacing={4}>
                    <Flex
                      w="42px"
                      h="42px"
                      flex="0 0 auto"
                      align="center"
                      justify="center"
                      bg="brand.50"
                      color="brand.600"
                      borderRadius="8px"
                    >
                      <Icon as={step.icon} />
                    </Flex>
                    <Box>
                      <Text fontWeight="extrabold" color="navy.700" mb={1}>
                        {step.title}
                      </Text>
                      <Text color="gray.600" lineHeight="1.65">
                        {step.text}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      <Box bg="navy.700" color="white" py={[12, 14]} px={[4, 6, 8]}>
        <Flex
          maxW="1120px"
          mx="auto"
          align={["start", "start", "center"]}
          justify="space-between"
          gap={6}
          direction={["column", "column", "row"]}
        >
          <Box maxW="720px">
            <Heading as="h2" fontSize={["2xl", "3xl"]} mb={3}>
              Готовы доверить подбор исполнителей нам?
            </Heading>
            <Text color="whiteAlpha.850" fontSize="lg">
              Тогда переходим к практической части: ZIP-коды, дата, размер
              переезда и подбор подходящих муверов.
            </Text>
          </Box>
          <Button
            as={RouterLink}
            to="/quote"
            size="lg"
            h="56px"
            px={7}
            bg="brand.500"
            color="white"
            rightIcon={<Icon as={FaArrowRight} />}
            _hover={{ bg: "brand.600", textDecoration: "none" }}
          >
            Перейти к подбору
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default LandingPage;
