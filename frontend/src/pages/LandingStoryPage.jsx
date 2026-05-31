import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Badge,
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
  FaCamera,
  FaHome,
  FaPenNib,
  FaRegCommentDots,
  FaRoute,
  FaTools,
  FaTruckMoving,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import heroImg from "../assets/newWorldHero.png";

const audiences = [
  {
    icon: FaRoute,
    title: "Planning a move",
    text: "Tell us what feels unclear: timing, budget, packing, kids, pets, distance, fragile things, furniture, or the fear that the new place will not feel like home yet.",
    action: "Share concerns",
  },
  {
    icon: FaBoxOpen,
    title: "Already moved",
    text: "Leave the honest review: what helped, what broke the day, who showed up well, what you wish someone had warned you about before the truck arrived.",
    action: "Leave a story",
  },
  {
    icon: FaTruckMoving,
    title: "Movers and helpers",
    text: "Tell us what makes a move run clean: better photos, clearer inventory, parking details, building rules, elevator windows, payment expectations, and realistic schedules.",
    action: "Join the network",
  },
];

const creatorIdeas = [
  {
    icon: FaCamera,
    title: "Films and short stories",
    text: "A family leaving a familiar house, a cross-country road, a first night in a new city, a last look at an empty room.",
  },
  {
    icon: FaPenNib,
    title: "Articles, books, games, quests",
    text: "Real moving routes, neighborhood discoveries, packing rituals, travel prompts, home memory quests, and relocation guides.",
  },
  {
    icon: FaHome,
    title: "The next home atmosphere",
    text: "Furniture sales, room setups, familiar smells, playlists, kids' corners, and small objects that carry the old home into the new one.",
  },
];

const LandingStoryPage = () => {
  return (
    <Box w="100%" minH="100vh" bg="#fffaf3" color="#1d2724" overflowX="hidden">
      <Navbar />

      <Box
        as="main"
        position="relative"
        minH={["auto", "auto", "calc(100vh - 92px)"]}
        pt={["116px", "120px", "132px"]}
        pb={[12, 14, 18]}
        bg="#14211d"
        overflow="hidden"
      >
        <Image
          src={heroImg}
          alt="A family move with warm home atmosphere"
          position="absolute"
          inset={0}
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="center"
          opacity={0.76}
        />
        <Box position="absolute" inset={0} bg="rgba(12, 19, 17, 0.48)" />
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(90deg, rgba(18,25,22,0.95) 0%, rgba(18,25,22,0.78) 48%, rgba(18,25,22,0.22) 100%)"
        />

        <Flex
          position="relative"
          zIndex={1}
          maxW="1180px"
          mx="auto"
          px={[4, 6, 8]}
          minH={["auto", "auto", "calc(100vh - 190px)"]}
          align="center"
        >
          <VStack align="start" spacing={6} maxW="760px">
            <Badge
              px={4}
              py={2}
              bg="rgba(255,250,243,0.14)"
              color="white"
              border="1px solid rgba(255,250,243,0.28)"
              borderRadius="8px"
              letterSpacing="0.08em"
            >
              Holy Move is listening before it launches wider
            </Badge>

            <Heading
              as="h1"
              color="white"
              fontSize={["4xl", "5xl", "6xl"]}
              lineHeight="1"
              fontWeight="black"
              maxW="780px"
            >
              Every move has a story before it has a price.
            </Heading>

            <Text color="whiteAlpha.900" fontSize={["lg", "xl"]} lineHeight="1.7" maxW="700px">
              We are building Holy Move around real people: families getting
              ready, people who already crossed the hard day, movers who know
              the field, and creators who can turn a relocation into film,
              writing, games, quests, travel routes, furniture stories, and the
              atmosphere of a new home.
            </Text>

            <Text color="white" fontSize={["xl", "2xl"]} fontWeight="extrabold">
              Tell us what happened, what worries you, or what you can help create.
            </Text>

            <HStack spacing={4} flexWrap="wrap">
              <Button
                as="a"
                href="#join"
                size="lg"
                h="56px"
                px={7}
                bg="#ff7a45"
                color="white"
                rightIcon={<Icon as={FaArrowRight} />}
                _hover={{ bg: "#ea6332", textDecoration: "none" }}
              >
                Choose your entrance
              </Button>
              <Button
                as={RouterLink}
                to="/quote"
                size="lg"
                h="56px"
                px={7}
                variant="outline"
                color="white"
                borderColor="whiteAlpha.700"
                _hover={{ bg: "whiteAlpha.200", textDecoration: "none" }}
              >
                Try moving quote
              </Button>
            </HStack>
          </VStack>
        </Flex>
      </Box>

      <Box id="join" bg="#fffaf3" py={[12, 16, 20]} px={[4, 6, 8]}>
        <Box maxW="1180px" mx="auto">
          <VStack align="start" spacing={4} mb={9}>
            <Text color="#c05621" fontWeight="black" letterSpacing="0.08em" fontSize="sm">
              THREE REAL ENTRANCES
            </Text>
            <Heading as="h2" fontSize={["3xl", "4xl"]} lineHeight="1.1" color="#243b35">
              Come in from the place you are standing now.
            </Heading>
            <Text color="gray.700" fontSize="lg" lineHeight="1.75" maxW="780px">
              We do not need to expose the whole system to show the result. We
              can show the atmosphere: clearer moves, better questions, useful
              reviews, cleaner work for movers, and creative life around the
              journey from one home to another.
            </Text>
          </VStack>

          <SimpleGrid columns={[1, 1, 3]} spacing={5}>
            {audiences.map((item) => (
              <Box
                key={item.title}
                bg="white"
                border="1px solid"
                borderColor="#eadfce"
                borderRadius="8px"
                p={[5, 6]}
                shadow="0 16px 42px rgba(46, 37, 26, 0.08)"
              >
                <Flex
                  w="48px"
                  h="48px"
                  align="center"
                  justify="center"
                  bg="#fff1e8"
                  color="#c05621"
                  borderRadius="8px"
                  mb={5}
                >
                  <Icon as={item.icon} boxSize={5} />
                </Flex>
                <Heading as="h3" fontSize="xl" color="#243b35" mb={3}>
                  {item.title}
                </Heading>
                <Text color="gray.650" lineHeight="1.7" mb={5}>
                  {item.text}
                </Text>
                <Button
                  as="a"
                  href="mailto:hello@holymove.ai?subject=Holy%20Move%20early%20access"
                  variant="outline"
                  borderColor="#d9c5a9"
                  color="#243b35"
                  rightIcon={<Icon as={FaRegCommentDots} />}
                  _hover={{ bg: "#fff7ed", textDecoration: "none" }}
                >
                  {item.action}
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      <Box bg="#edf4f1" py={[12, 16, 20]} px={[4, 6, 8]}>
        <Box maxW="1180px" mx="auto">
          <SimpleGrid columns={[1, 1, 2]} spacing={[8, 10, 14]} alignItems="center">
            <VStack align="start" spacing={5}>
              <Text color="#2f6f5f" fontWeight="black" letterSpacing="0.08em" fontSize="sm">
                FOR CREATORS AROUND THE MOVE
              </Text>
              <Heading as="h2" fontSize={["3xl", "4xl"]} lineHeight="1.1" color="#243b35">
                A move can become more than logistics.
              </Heading>
              <Text color="gray.700" fontSize="lg" lineHeight="1.8">
                People need boxes and trucks, but they also need memory, story,
                confidence, and a way to make the next place feel alive. Holy
                Move is a place where practical relocation can meet creators,
                writers, filmmakers, quest designers, furniture sellers, local
                guides, and home atmosphere builders.
              </Text>
            </VStack>

            <VStack align="stretch" spacing={4}>
              {creatorIdeas.map((item) => (
                <HStack
                  key={item.title}
                  align="start"
                  spacing={4}
                  bg="white"
                  border="1px solid"
                  borderColor="#d7e3dd"
                  borderRadius="8px"
                  p={5}
                >
                  <Flex
                    w="42px"
                    h="42px"
                    flex="0 0 auto"
                    align="center"
                    justify="center"
                    bg="#e3f3ed"
                    color="#2f6f5f"
                    borderRadius="8px"
                  >
                    <Icon as={item.icon} />
                  </Flex>
                  <Box>
                    <Text fontWeight="extrabold" color="#243b35" mb={1}>
                      {item.title}
                    </Text>
                    <Text color="gray.600" lineHeight="1.65">
                      {item.text}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
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
          <Box maxW="760px">
            <HStack spacing={3} mb={3}>
              <Icon as={FaTools} color="#f8bd66" />
              <Text color="#f8bd66" fontWeight="black" letterSpacing="0.08em" fontSize="sm">
                BUILDING WITH REAL INPUT
              </Text>
            </HStack>
            <Heading as="h2" fontSize={["2xl", "3xl"]} mb={3}>
              Bring us the review, the worry, the skill, or the idea.
            </Heading>
            <Text color="whiteAlpha.850" fontSize="lg" lineHeight="1.7">
              We will use it to shape a calmer moving experience without showing
              the private mechanics too early.
            </Text>
          </Box>
          <Button
            as="a"
            href="mailto:hello@holymove.ai?subject=Holy%20Move%20entry"
            size="lg"
            h="56px"
            px={7}
            bg="#ff7a45"
            color="white"
            rightIcon={<Icon as={FaArrowRight} />}
            _hover={{ bg: "#ea6332", textDecoration: "none" }}
          >
            Contact Holy Move
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default LandingStoryPage;
