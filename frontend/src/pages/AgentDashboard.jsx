import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const AgentDashboard = () => {
  const navigate = useNavigate()

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="gray.700" color="white" py={4}>
        <Container maxW="7xl">
          <Flex align="center">
            <VStack align="start" spacing={0}>
              <Heading size="lg">👔 Agent Dashboard</Heading>
              <Text opacity={0.9}>Help your clients move seamlessly</Text>
            </VStack>
            <Spacer />
            <Button variant="outline" colorScheme="whiteAlpha" onClick={() => navigate('/')}>
              Home
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={16}>
        <VStack spacing={8} textAlign="center">
          <Heading size="xl">🚧 Coming Soon</Heading>
          <Text fontSize="lg" color="gray.600" maxW="md">
            The real estate agent dashboard is under construction. 
            You'll be able to help clients find moving services and track their progress.
          </Text>
          <Button colorScheme="gray" size="lg">
            Join Waitlist
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default AgentDashboard
