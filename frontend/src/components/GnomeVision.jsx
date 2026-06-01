import React, { useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCompressAlt,
  FaExpandAlt,
  FaEye,
  FaRegWindowMinimize,
} from "react-icons/fa";
import dwarfImg from "../assets/myDwarf.png";
import stage1Img from "../../../content/images/TravelSlydeShow/1/1.png";
import stage2Img from "../../../content/images/TravelSlydeShow/2/2.png";
import stage3Img from "../../../content/images/TravelSlydeShow/3/3.png";
import stage4Img from "../../../content/images/TravelSlydeShow/4/4.png";
import stage5Img from "../../../content/images/TravelSlydeShow/5/ChatGPT Image 27 мая 2026 г., 19_11_33.png";
import stage6Img from "../../../content/images/TravelSlydeShow/6/6.png";
import stage7Img from "../../../content/images/TravelSlydeShow/7/7.png";
import stage8Img from "../../../content/images/TravelSlydeShow/8/8.png";
import stage9Img from "../../../content/images/TravelSlydeShow/9/9.png";
import stage10Img from "../../../content/images/TravelSlydeShow/10/ChatGPT Image 27 мая 2026 г., 20_15_47.png";

const gnomeNotes = [
  "First I look for the tiny brave things: the mug, the lamp, the chair that already knows your stories.",
  "Then I give every box a name, because unnamed boxes behave like a mystery at midnight.",
  "A move is not a straight line. It is a small parade of socks, memories, keys, and one heroic roll of tape.",
  "When the room looks messy, I squint a little. Suddenly it becomes a map.",
  "The truck is never just a truck. It is a temporary castle on wheels.",
  "I keep an eye on the fragile stuff and on the people pretending they are not tired.",
  "Somewhere between the old door and the new one, the family starts becoming lighter.",
  "The best moment is when the first familiar object lands in the new room and says: yes, we live here now.",
  "If the client wants a quiet look, I whisper. If they want the whole vision, I open the curtain.",
  "By the end, the boxes are not the story. The first calm breath in the new home is the story.",
];

const slides = [
  stage1Img,
  stage2Img,
  stage3Img,
  stage4Img,
  stage5Img,
  stage6Img,
  stage7Img,
  stage8Img,
  stage9Img,
  stage10Img,
].map((src, index) => ({
  src,
  stage: `Vision ${index + 1}`,
  note: gnomeNotes[index],
}));

const GnomeVision = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState("soft");

  const currentSlide = slides[currentIndex] ?? slides[0];
  const isFull = viewMode === "full";
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === slides.length - 1;

  const openAtStart = () => {
    setCurrentIndex(0);
    onOpen();
  };

  const showPrevious = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const showNext = () => {
    setCurrentIndex((index) => Math.min(slides.length - 1, index + 1));
  };

  const startOver = () => {
    setCurrentIndex(0);
  };

  if (!slides.length) {
    return null;
  }

  return (
    <>
      <Box
        bg="white"
        p={4}
        borderRadius="8px"
        boxShadow="md"
        border="1px"
        borderColor="orange.100"
        position="relative"
      >
        <Stack direction={{ base: "column", sm: "row" }} spacing={4} align="center">
          <Image
            src={dwarfImg}
            alt="Holy Move gnome"
            boxSize="54px"
            borderRadius="full"
            objectFit="cover"
          />
          <VStack spacing={1} align={{ base: "center", sm: "flex-start" }} flex={1}>
            <Text fontSize="sm" color="gray.600">
              The gnome has a private moving diary.
            </Text>
            <Text fontWeight="bold" color="navy.600">
              Want to know how I see the move?
            </Text>
          </VStack>
          <Button
            leftIcon={<FaEye />}
            colorScheme="orange"
            variant="solid"
            onClick={openAtStart}
            whiteSpace="normal"
          >
            Show Me
          </Button>
        </Stack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size={isFull ? "full" : "4xl"} isCentered>
        <ModalOverlay bg={isFull ? "blackAlpha.800" : "blackAlpha.500"} />
        <ModalContent
          mx={isFull ? 0 : 4}
          my={isFull ? 0 : 6}
          maxH={isFull ? "100vh" : "88vh"}
          borderRadius={isFull ? 0 : "8px"}
          overflow="hidden"
          bg="white"
        >
          <ModalCloseButton zIndex={2} />
          <ModalBody p={0}>
            <Flex direction={{ base: "column", lg: isFull ? "row" : "column" }} minH={isFull ? "100vh" : "auto"}>
              <Box
                bg="gray.900"
                flex={1}
                minH={{ base: isFull ? "56vh" : "320px", md: isFull ? "100vh" : "520px" }}
                position="relative"
              >
                <Image
                  src={currentSlide.src}
                  alt={`${currentSlide.stage} through the gnome's eyes`}
                  w="100%"
                  h="100%"
                  maxH={isFull ? "100vh" : "620px"}
                  objectFit="contain"
                />
                <IconButton
                  aria-label="Previous gnome vision"
                  icon={<FaChevronLeft />}
                  onClick={showPrevious}
                  isDisabled={isFirstSlide}
                  position="absolute"
                  left={4}
                  top="50%"
                  transform="translateY(-50%)"
                  borderRadius="full"
                  colorScheme="orange"
                />
                <IconButton
                  aria-label="Next gnome vision"
                  icon={<FaChevronRight />}
                  onClick={showNext}
                  isDisabled={isLastSlide}
                  position="absolute"
                  right={4}
                  top="50%"
                  transform="translateY(-50%)"
                  borderRadius="full"
                  colorScheme="orange"
                />
              </Box>

              <VStack
                align="stretch"
                spacing={5}
                w={{ base: "100%", lg: isFull ? "380px" : "100%" }}
                p={{ base: 5, md: 7 }}
                bg="white"
              >
                <HStack justify="space-between" align="start" pr={8}>
                  <VStack align="flex-start" spacing={2}>
                    <Badge colorScheme="orange" borderRadius="8px">
                      {currentSlide.stage}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      {currentIndex + 1} of {slides.length}
                    </Text>
                  </VStack>
                  <ButtonGroup size="sm" isAttached variant="outline">
                    <IconButton
                      aria-label="Soft view"
                      icon={<FaRegWindowMinimize />}
                      colorScheme={isFull ? "gray" : "orange"}
                      onClick={() => setViewMode("soft")}
                    />
                    <IconButton
                      aria-label="Full screen view"
                      icon={isFull ? <FaCompressAlt /> : <FaExpandAlt />}
                      colorScheme={isFull ? "orange" : "gray"}
                      onClick={() => setViewMode(isFull ? "soft" : "full")}
                    />
                  </ButtonGroup>
                </HStack>

                <HStack align="flex-start" spacing={4}>
                  <Flex
                    boxSize="44px"
                    borderRadius="full"
                    bg="orange.50"
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <Icon as={FaEye} color="orange.500" />
                  </Flex>
                  <Text fontSize={{ base: "lg", md: "xl" }} color="navy.600" lineHeight="1.45" fontWeight="semibold">
                    {currentSlide.note}
                  </Text>
                </HStack>

                <HStack spacing={3} pt={2}>
                  {isLastSlide ? (
                    <Button onClick={startOver} colorScheme="orange">
                      Start over
                    </Button>
                  ) : (
                    <Button onClick={showNext} colorScheme="orange" rightIcon={<FaChevronRight />}>
                      Continue
                    </Button>
                  )}
                  <Button onClick={onClose} variant="ghost">
                    Enough magic
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GnomeVision;
