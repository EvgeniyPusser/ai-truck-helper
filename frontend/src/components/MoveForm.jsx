// import React, { useState } from "react";
// import { Box, VStack, Input, Button, Select, Heading, FormLabel } from "@chakra-ui/react";

// const MoveForm = ({ onSubmit }) => {
//   const [pickupZip, setPickupZip] = useState("");
//   const [dropoffZip, setDropoffZip] = useState("");
//   const [rooms, setRooms] = useState(1);
//   const [volume, setVolume] = useState(20);
//   const [date, setDate] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({ pickupZip, dropoffZip, rooms, volume, date });
//   };

//   return (
//     <Box bg="white" p={6} rounded="md" shadow="md" maxW="400px" mx="auto">
//       <Heading size="md" mb={4}>Calculate Your Move</Heading>
//       <form onSubmit={handleSubmit}>
//         <VStack spacing={4}>
//           <Box w="100%">
//             <label>Pickup ZIP</label>
//             <Input value={pickupZip} onChange={e => setPickupZip(e.target.value)} required />
//           </Box>
//           <Box w="100%">
//             <label>Dropoff ZIP</label>
//             <Input value={dropoffZip} onChange={e => setDropoffZip(e.target.value)} required />
//           </Box>
//           <Box w="100%">
//             <label>Rooms</label>
//             <Select value={rooms} onChange={e => setRooms(Number(e.target.value))}>
//               {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
//             </Select>
//           </Box>
//           <Box w="100%">
//             <label>Volume (cu.m)</label>
//             <Input type="number" value={volume} onChange={e => setVolume(Number(e.target.value))} min={1} />
//           </Box>
//           <Box w="100%">
//             <label>Date</label>
//             <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
//           </Box>
//           <Button colorScheme="blue" type="submit" w="100%">Calculate</Button>
//         </VStack>
//       </form>
//     </Box>
//   );
// };

// export default MoveForm;

import React, { useState } from "react";
import {
  Box,
  VStack,
  Input,
  Button,
  Select,
  Heading,
  FormControl,
  FormLabel
} from "@chakra-ui/react";


const MoveForm = ({ onSubmit }) => {
  const [pickupZip, setPickupZip] = useState("");
  const [dropoffZip, setDropoffZip] = useState("");
  const [rooms, setRooms] = useState(1);
  const [volume, setVolume] = useState(20);
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ pickupZip, dropoffZip, rooms, volume, date });
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
            <Select id="rooms" value={rooms} onChange={e => setRooms(Number(e.target.value))}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="volume">Volume (cu.m)</FormLabel>
            <Input id="volume" type="number" value={volume} onChange={e => setVolume(Number(e.target.value))} min={1} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="date">Date</FormLabel>
            <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </FormControl>

          <Button colorScheme="blue" type="submit" w="100%">Calculate</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default MoveForm;

