import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Grid,
  GridItem,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const PlanningPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const searchData = location.state || {}
  const [showChat, setShowChat] = useState(false)

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow="sm" py={4}>
        <Container maxW="7xl">
          <Flex align="center">
            <Heading size="lg" color="brand.500">
              🏠 Holly Move
            </Heading>
            <Spacer />
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Search
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        <Grid templateColumns="1fr 400px" gap={8}>
          {/* Main Planning Area */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              <Box bg="white" p={6} rounded="xl" shadow="sm">
                <Heading size="lg" mb={4}>
                  Your Move: {searchData.zipFrom} → {searchData.zipTo}
                </Heading>
                <Text color="gray.600">
                  Date: {searchData.moveDate} | Type: {searchData.moveType}
                </Text>
              </Box>

              {/* Moving Options */}
              <Box bg="white" p={6} rounded="xl" shadow="sm">
                <Heading size="md" mb={4}>
                  📦 Moving Options
                </Heading>
                <VStack spacing={4}>
                  <Box p={4} border="1px" borderColor="gray.200" rounded="lg" w="full">
                    <Text fontWeight="bold">🚚 Full-Service Moving Company</Text>
                    <Text fontSize="sm" color="gray.600">Professional movers handle everything</Text>
                    <Text fontWeight="bold" color="green.500">$2,400 - $3,200</Text>
                  </Box>
                  
                  <Box p={4} border="1px" borderColor="gray.200" rounded="lg" w="full">
                    <Text fontWeight="bold">🤝 Truck + Helpers (Cross-loading)</Text>
                    <Text fontSize="sm" color="gray.600">Rent truck + hire local helpers</Text>
                    <Text fontWeight="bold" color="green.500">$800 - $1,200</Text>
                  </Box>
                  
                  <Box p={4} border="1px" borderColor="gray.200" rounded="lg" w="full">
                    <Text fontWeight="bold">📦 Container Sharing</Text>
                    <Text fontSize="sm" color="gray.600">Share container space with others</Text>
                    <Text fontWeight="bold" color="green.500">$600 - $900</Text>
                  </Box>
                  
                  <Box p={4} border="1px" borderColor="gray.200" rounded="lg" w="full">
                    <Text fontWeight="bold">🚛 DIY Truck Rental</Text>
                    <Text fontSize="sm" color="gray.600">Do it yourself with rental truck</Text>
                    <Text fontWeight="bold" color="green.500">$300 - $500</Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </GridItem>

          {/* Chat with Gnome */}
          <GridItem>
            <Box bg="white" p={6} rounded="xl" shadow="sm" h="600px">
              <VStack spacing={4} h="full">
                <Heading size="md" color="gnome.500">
                  🧙‍♂️ Chat with Holly the Gnome
                </Heading>
                
                {!showChat ? (
                  <VStack spacing={4} justify="center" h="full">
                    <Text textAlign="center" color="gray.600">
                      Hi! I'm Holly, your moving assistant. I can help you find the best moving option for your needs.
                    </Text>
                    <Button
                      colorScheme="gnome"
                      onClick={() => setShowChat(true)}
                    >
                      Start Chat
                    </Button>
                  </VStack>
                ) : (
                  <Box flex={1} w="full" border="1px" borderColor="gray.200" rounded="lg" p={4}>
                    <VStack spacing={3} align="stretch">
                      <Box bg="gnome.50" p={3} rounded="lg">
                        <Text fontSize="sm">
                          🧙‍♂️ <strong>Holly:</strong> I see you're moving from {searchData.zipFrom} to {searchData.zipTo}. 
                          Based on the distance and your {searchData.moveType}, I'd recommend the cross-loading option. 
                          Would you like me to explain why?
                        </Text>
                      </Box>
                      
                      <Box bg="blue.50" p={3} rounded="lg" alignSelf="flex-end" maxW="80%">
                        <Text fontSize="sm">
                          <strong>You:</strong> Yes, tell me more about cross-loading!
                        </Text>
                      </Box>
                      
                      <Box bg="gnome.50" p={3} rounded="lg">
                        <Text fontSize="sm">
                          🧙‍♂️ <strong>Holly:</strong> Cross-loading combines the best of both worlds! 
                          You get a professional truck for the long-distance part, and local helpers 
                          at both ends. This saves 40% compared to full-service movers while still 
                          being much easier than pure DIY. Want to see available options?
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}

export default PlanningPage
