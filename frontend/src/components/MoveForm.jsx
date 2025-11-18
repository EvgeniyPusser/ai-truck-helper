import React, { useState } from "react";
import { Box, VStack, Input, Button, Select, Heading, FormLabel, FormControl } from "@chakra-ui/react";

const MoveForm = ({ onSubmit }) => {
  const [pickupZip, setPickupZip] = useState("");
  const [dropoffZip, setDropoffZip] = useState("");
  const [rooms, setRooms] = useState(1);
  const [volume, setVolume] = useState(12); // default for 1 room

  // Estimate volume by rooms (same as backend)
  function estimateVolumeByRooms(rooms) {
    if (rooms <= 0) return 7;
    if (rooms === 1) return 12;
    if (rooms === 2) return 20;
    if (rooms === 3) return 30;
    if (rooms === 4) return 40;
    return 50;
  }

  // When rooms changes, auto-set volume
  const handleRoomsChange = (e) => {
    const r = Number(e.target.value);
    setRooms(r);
    setVolume(estimateVolumeByRooms(r));
  };
  const [date, setDate] = useState("");

  // 👇 локальная "сегодняшняя" дата в формате YYYY-MM-DD (без UTC-сдвига)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  const handleSubmit = (e) => {
    e.preventDefault();

    // дополнительная защита на случай старых браузеров
    if (date && date < minDate) {
      alert("Please choose a date that is today or later.");
      return;
    }

    // Отправляем и rooms, и helpers для совместимости
    onSubmit({ 
      pickupZip, 
      dropoffZip, 
      helpers: rooms, 
      rooms: rooms, 
      volume, 
      date 
    });
  };

  return (
    <Box bg="white" p={6} rounded="md" shadow="md" maxW="400px" mx="auto">
      <Heading size="md" mb={4}>Calculate Your Move</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="pickupZip">Pickup ZIP</FormLabel>
            <Input id="pickupZip" value={pickupZip} onChange={e => setPickupZip(e.target.value)} inputMode="numeric" pattern="\d{5}" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="dropoffZip">Dropoff ZIP</FormLabel>
            <Input id="dropoffZip" value={dropoffZip} onChange={e => setDropoffZip(e.target.value)} inputMode="numeric" pattern="\d{5}" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="rooms">Rooms</FormLabel>
            <Select id="rooms" value={rooms} onChange={handleRoomsChange}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="volume">Volume (cu.m)</FormLabel>
            <Input id="volume" type="number" value={volume} onChange={e => setVolume(Number(e.target.value))} min={1} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="date">Date</FormLabel>
            <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} min={minDate} />
          </FormControl>
          <Button colorScheme="blue" type="submit" w="100%">Calculate</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default MoveForm;


