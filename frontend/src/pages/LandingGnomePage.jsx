import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCamera,
  FaHeart,
  FaMagic,
  FaPenNib,
  FaRoute,
  FaTruckMoving,
  FaLanguage,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import heroImg from "../assets/newWorldHero.png";

const contactHref = "mailto:hello@holymove.ai?subject=Holy%20Move%20early%20access";

const audiences = [
  {
    icon: FaRoute,
    title: "Planning a Move",
    text: "Tell us what feels unclear: timing, budget, kids, pets, or the fear that the new place will not feel like home yet. We transform chaos into a story.",
    action: "Share Concerns",
    color: "blue.500",
  },
  {
    icon: FaBoxOpen,
    title: "Already Moved",
    text: "Leave an honest review: what helped, what broke the day, or what you wish someone had warned you about before the truck arrived.",
    action: "Leave a Story",
    color: "green.500",
  },
  {
    icon: FaTruckMoving,
    title: "Movers & Helpers",
    text: "Tell us what makes a move run clean: better photos, clearer inventory, elevator windows, and realistic schedules.",
    action: "Join the Network",
    color: "orange.500",
  },
];

const creatorIdeas = [
  {
    icon: FaCamera,
    title: "Films & Stories",
    text: "Help us film the Hollywood-style journey of a family and their Garden Gnome across the country.",
  },
  {
    icon: FaPenNib,
    title: "Writers & Poets",
    text: "Create the Chronicles of the Move, transforming logistics into a legend for the next generation.",
  },
  {
    icon: FaMagic,
    title: "Game Designers",
    text: "Help us build the Quest for the New Home, making every box a treasure chest for children.",
  },
];

const LandingGnomePage = () => {
  const bgGradient = useColorModeValue(
    "linear(to-b, brand.50, white)",
    "linear(to-b, gray.900, gray.800)"
  );

  return (
    <Box minH="100vh" bg={bgGradient}>
      <Navbar />

      <Container maxW="container.xl" pt={{ base: 28, md: 36 }} pb={20}>
        <Stack direction={{ base: "column", md: "row" }} spacing={10} align="center">
          <VStack align="flex-start" spacing={6} flex={1}>
            <Badge colorScheme="orange" px={3} py={1} borderRadius="8px" fontSize="sm">
              Your Move Buddy is Here
            </Badge>
            <Heading as="h1" size="2xl" lineHeight="shorter" fontWeight="bold">
              Moving with a <Text as="span" color="orange.500">Soul</Text> in Los Angeles
            </Heading>
            <Text fontSize="xl" color="gray.600">
              We do not just move boxes. We protect your family's peace of mind.
              Let our <strong>Garden Gnome</strong> turn your relocation
              catastrophe into a magical family story.
            </Text>
            <HStack spacing={4} pt={4} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/quote"
                size="lg"
                colorScheme="orange"
                px={8}
                rightIcon={<FaArrowRight />}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              >
                Start Your Story
              </Button>
              <Button
                as="a"
                href="#secret"
                size="lg"
                variant="outline"
                colorScheme="gray"
                leftIcon={<FaHeart />}
              >
                Our Philosophy
              </Button>
            </HStack>

            <Box
              bg="white"
              p={4}
              borderRadius="8px"
              boxShadow="md"
              border="1px"
              borderColor="orange.100"
              position="relative"
            >
              <HStack align="start">
                <Icon as={FaLanguage} color="orange.400" mt={1} />
                <Text fontSize="sm" fontStyle="italic">
                  "Shalom. I am your Move Buddy. I speak 5 languages and I am
                  ready for the Hollywood Move."
                </Text>
              </HStack>
            </Box>
          </VStack>

          <Box flex={1} position="relative">
            <Image
              src={heroImg}
              alt="Holy Move family story"
              position="relative"
              zIndex={1}
              borderRadius="8px"
              boxShadow="2xl"
            />
          </Box>
        </Stack>
      </Container>

      <Box id="secret" bg="white" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">The Gnome's Secret</Heading>
              <Text color="gray.600" maxW="2xl" fontSize="lg">
                Why do families in LA choose Holy Move? Because we understand
                that a house is not an address. It is where your heart is.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
              {audiences.map((item) => (
                <VStack
                  key={item.title}
                  p={8}
                  bg="gray.50"
                  borderRadius="8px"
                  align="flex-start"
                  spacing={4}
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-5px)", bg: "white", boxShadow: "xl" }}
                >
                  <Flex w="50px" h="50px" align="center" justify="center" bg={item.color} color="white" borderRadius="8px">
                    <Icon as={item.icon} boxSize={6} />
                  </Flex>
                  <Heading size="md">{item.title}</Heading>
                  <Text color="gray.600">{item.text}</Text>
                  <Button
                    as="a"
                    href={contactHref}
                    variant="link"
                    colorScheme="orange"
                    rightIcon={<FaArrowRight />}
                  >
                    {item.action}
                  </Button>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={20}>
        <Stack direction={{ base: "column", md: "row" }} spacing={16} align="center">
          <Box flex={1}>
            <Image
              src={heroImg}
              alt="Creative community around moving"
              borderRadius="8px"
              boxShadow="xl"
            />
          </Box>
          <VStack align="flex-start" spacing={8} flex={1.2}>
            <VStack align="flex-start" spacing={4}>
              <Badge colorScheme="purple" borderRadius="8px">Hollywood Edition</Badge>
              <Heading size="xl">The Creative Lab</Heading>
              <Text fontSize="lg" color="gray.600">
                We are looking for dreamers in LA: filmmakers, writers, and
                artists who want to turn the ordinary reality of moving into a
                Hollywood-style tale.
              </Text>
            </VStack>

            <SimpleGrid columns={1} spacing={6} w="full">
              {creatorIdeas.map((idea) => (
                <HStack key={idea.title} spacing={4} align="flex-start">
                  <Icon as={idea.icon} boxSize={5} mt={1} color="purple.500" />
                  <VStack align="flex-start" spacing={0}>
                    <Text fontWeight="bold">{idea.title}</Text>
                    <Text color="gray.600" fontSize="sm">{idea.text}</Text>
                  </VStack>
                </HStack>
              ))}
            </SimpleGrid>

            <Button as="a" href={contactHref} colorScheme="purple" size="lg" px={10}>
              Join the Creative Lab
            </Button>
          </VStack>
        </Stack>
      </Container>

      <Box bg="brand.900" color="white" py={20}>
        <Container maxW="container.xl">
          <Stack direction={{ base: "column", md: "row" }} justify="space-between" align="center" spacing={8}>
            <VStack align="flex-start" spacing={4}>
              <Heading size="lg">Live Journey Map</Heading>
              <Text opacity={0.8}>
                Follow the moving journey in real time. See where your Move
                Buddy is right now.
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/quote"
              size="lg"
              bg="white"
              color="brand.900"
              px={12}
              _hover={{ bg: "orange.50" }}
            >
              Check the Map
            </Button>
          </Stack>
        </Container>
      </Box>

      <Box py={10} borderTop="1px" borderColor="gray.100">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap={4}>
            <HStack spacing={2}>
              <Image src={heroImg} boxSize="30px" alt="Holy Move" borderRadius="8px" />
              <Text fontWeight="bold">Holy Move LA</Text>
            </HStack>
            <Text color="gray.500" fontSize="sm">
              2026 Holy Move. Made with love for families in Los Angeles.
            </Text>
            <HStack spacing={6}>
              <Text
                as={RouterLink}
                to="/privacy"
                fontSize="xs"
                color="gray.500"
                _hover={{ color: "brand.600", textDecoration: "underline" }}
              >
                Privacy Policy
              </Text>
              <Icon as={FaHeart} color="red.400" />
              <Text fontSize="xs">EN | HE | RU | ES | YI</Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingGnomePage;
