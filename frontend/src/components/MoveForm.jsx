import React, { useState } from "react";
import {
  SimpleGrid,
  VStack,
  Input,
  Button,
  Select,
  FormLabel,
  FormControl,
  Text,
  Icon,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";

const MoveForm = ({ onSubmit }) => {
  const [pickupZip, setPickupZip]   = useState("");
  const [dropoffZip, setDropoffZip] = useState("");
  const [rooms, setRooms]           = useState(1);
  const [volume, setVolume]         = useState(12);
  const [date, setDate]             = useState("");

  function estimateVolumeByRooms(r) {
    if (r <= 0) return 7;
    if (r === 1) return 12;
    if (r === 2) return 20;
    if (r === 3) return 30;
    if (r === 4) return 40;
    return 50;
  }

  const handleRoomsChange = (e) => {
    const r = Number(e.target.value);
    setRooms(r);
    setVolume(estimateVolumeByRooms(r));
  };

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date && date < minDate) {
      alert("Please choose a date that is today or later.");
      return;
    }
    onSubmit({ pickupZip, dropoffZip, helpers: rooms, rooms, volume, date });
  };

  const labelProps = {
    fontSize: "xs",
    fontWeight: "bold",
    color: "navy.600",
    textTransform: "uppercase",
    letterSpacing: "wider",
    mb: 1,
  };

  const inputProps = {
    size: "lg",
    borderColor: "gray.300",
    borderWidth: "1.5px",
    borderRadius: "8px",
    _focus: { borderColor: "navy.600", boxShadow: "0 0 0 1px #1A2B4B" },
    _hover: { borderColor: "navy.400" },
    bg: "white",
  };

  return (
    <form onSubmit={handleSubmit}>
      <SimpleGrid columns={[1, 2]} spacing={5} mb={5}>
        <FormControl isRequired>
          <FormLabel {...labelProps}>Pickup ZIP</FormLabel>
          <Input
            {...inputProps}
            value={pickupZip}
            onChange={(e) => setPickupZip(e.target.value)}
            inputMode="numeric"
            pattern="\d{5}"
            placeholder="e.g. 90001"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel {...labelProps}>Drop-off ZIP</FormLabel>
          <Input
            {...inputProps}
            value={dropoffZip}
            onChange={(e) => setDropoffZip(e.target.value)}
            inputMode="numeric"
            pattern="\d{5}"
            placeholder="e.g. 10001"
          />
        </FormControl>

        <FormControl>
          <FormLabel {...labelProps}>Move Size</FormLabel>
          <Select {...inputProps} value={rooms} onChange={handleRoomsChange}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} room{n > 1 ? "s" : ""}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel {...labelProps}>Volume (cu.m)</FormLabel>
          <Input
            {...inputProps}
            type="number"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            min={1}
          />
        </FormControl>
      </SimpleGrid>

      <FormControl isRequired mb={6}>
        <FormLabel {...labelProps}>Move Date</FormLabel>
        <Input
          {...inputProps}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={minDate}
        />
      </FormControl>

      <Button
        type="submit"
        w="100%"
        size="lg"
        bg="brand.500"
        color="white"
        fontWeight="extrabold"
        fontSize="lg"
        letterSpacing="0.06em"
        h="56px"
        borderRadius="10px"
        rightIcon={<Icon as={FaArrowRight} />}
        _hover={{ bg: "brand.600", transform: "translateY(-2px)", shadow: "lg" }}
        _active={{ bg: "brand.700", transform: "translateY(0)" }}
        transition="all 0.2s"
      >
        CALCULATE MY MOVE
      </Button>

      <Text fontSize="xs" color="gray.500" textAlign="center" mt={3}>
        Free · No commitment · Instant results
      </Text>
    </form>
  );
};

export default MoveForm;
