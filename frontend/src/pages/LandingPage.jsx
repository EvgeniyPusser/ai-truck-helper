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
    title: "Calm the house first",
    text: "Kids, pets, parents, grandparents, favorite toys, old photos, tiny routines. A move feels easier when everyone knows this is still your home, just on its way to a new chapter.",
  },
  {
    icon: FaTasks,
    title: "Turn the mess into a plan",
    text: "We help you think through what matters before the boxes take over: timing, rooms, fragile things, family needs, and the questions movers should answer clearly.",
  },
  {
    icon: FaBoxOpen,
    title: "Then we bring in the movers",
    text: "When you are ready for us to help choose the crew, we ask for the ZIP codes, move date, and move size. That starts the same working quote flow you already know.",
  },
];

const LandingPage = () => {
  return (
    <Box w="100%" minH="100vh" bg="#fffaf3" color="gray.900" overflowX="hidden">
      <Navbar />

      <Box
        as="main"
        position="relative"
        minH={["auto", "auto", "calc(100vh - 92px)"]}
        pt={["112px", "116px", "124px"]}
        pb={[10, 12, 16]}
        bg="#17231e"
        overflow="hidden"
      >
        <Image
          src={heroImg}
          alt="A warm Los Angeles moving story"
          position="absolute"
          inset={0}
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="center"
          opacity={0.78}
        />
        <Box position="absolute" inset={0} bg="rgba(12, 20, 17, 0.42)" />
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(90deg, rgba(18,25,22,0.92) 0%, rgba(18,25,22,0.70) 46%, rgba(18,25,22,0.18) 100%)"
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
          <VStack align="start" spacing={6} maxW="700px">
            <HStack
              spacing={3}
              px={4}
              py={2}
              bg="rgba(255,250,243,0.14)"
              border="1px solid rgba(255,250,243,0.28)"
              borderRadius="full"
              color="white"
            >
              <Icon as={FaHome} color="#f8bd66" />
              <Text fontSize="sm" fontWeight="bold">
                Los Angeles moving help for real families
              </Text>
            </HStack>

            <Heading
              as="h1"
              color="white"
              fontSize={["4xl", "5xl", "6xl"]}
              lineHeight="0.98"
              fontWeight="black"
            >
              Moving?
              <Text as="span" display="block" color="#f8bd66">
                Feels like a disaster?
              </Text>
              There is a calmer way.
            </Heading>

            <Text color="whiteAlpha.900" fontSize={["lg", "xl"]} lineHeight="1.65" maxW="640px">
              A move does not have to become the day your home fell apart into
              boxes. It can become part of your family story: kids, pets, older
              parents, favorite things, familiar voices, and the new address
              waiting on the other side.
            </Text>

            <Text color="white" fontSize={["xl", "2xl"]} fontWeight="extrabold">
              Our home is moving with us. Everything is going to be okay.
            </Text>

            <HStack spacing={4} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/quote"
                size="lg"
                h="56px"
                px={7}
                bg="#ff7a45"
                color="white"
                rightIcon={<Icon as={FaArrowRight} />}
                _hover={{ bg: "#ea6332", textDecoration: "none" }}
              >
                Help us choose movers
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
                First, make it feel manageable
              </Button>
            </HStack>
          </VStack>
        </Flex>
      </Box>

      <Box id="story" bg="#fffaf3" py={[12, 16, 20]} px={[4, 6, 8]}>
        <Box maxW="1120px" mx="auto">
          <SimpleGrid columns={[1, 1, 2]} spacing={[8, 10, 14]} alignItems="center">
            <VStack align="start" spacing={5}>
              <Text color="#c05621" fontWeight="black" letterSpacing="0.08em" fontSize="sm">
                NOT ZIP CODES FIRST. PEOPLE FIRST.
              </Text>
              <Heading as="h2" fontSize={["3xl", "4xl"]} lineHeight="1.1" color="#243b35">
                Before we calculate the move, we help you understand the move.
              </Heading>
              <Text color="gray.700" fontSize="lg" lineHeight="1.8">
                Moving feels heavy because it looks like lost control. Holy Move
                turns that feeling into a clear sequence: protect the family
                rhythm, make a practical plan, then bring in movers when the
                household is ready.
              </Text>
            </VStack>

            <Box
              bg="white"
              border="1px solid"
              borderColor="#eadfce"
              borderRadius="8px"
              p={[5, 7]}
              shadow="0 18px 50px rgba(46, 37, 26, 0.10)"
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
                      bg="#fff1e8"
                      color="#c05621"
                      borderRadius="8px"
                    >
                      <Icon as={step.icon} />
                    </Flex>
                    <Box>
                      <Text fontWeight="extrabold" color="#243b35" mb={1}>
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

      <Box bg="#243b35" color="white" py={[12, 14]} px={[4, 6, 8]}>
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
              Ready for us to help find the movers?
            </Heading>
            <Text color="whiteAlpha.850" fontSize="lg">
              Then we move into the practical part: ZIP codes, date, move size,
              and a working quote flow for matching the right moving help.
            </Text>
          </Box>
          <Button
            as={RouterLink}
            to="/quote"
            size="lg"
            h="56px"
            px={7}
            bg="#ff7a45"
            color="white"
            rightIcon={<Icon as={FaArrowRight} />}
            _hover={{ bg: "#ea6332", textDecoration: "none" }}
          >
            Start the calculations
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default LandingPage;
