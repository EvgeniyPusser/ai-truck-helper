import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTruck, FaHandsHelping, FaBuilding, FaUserTie } from 'react-icons/fa'

const LandingPage = () => {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    zipFrom: '',
    zipTo: '',
    moveDate: '',
    moveType: '',
  })

  const handleSearch = () => {
    // Navigate to planning page with search data
    navigate('/planning', { state: searchData })
  }

  const handleRoleNavigation = (role) => {
    navigate(`/${role}`)
  }

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
            <Button variant="outline" colorScheme="brand">
              Sign In
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="6xl" py={16}>
        <VStack spacing={12} align="center">
          {/* Hero Section */}
          <VStack spacing={6} textAlign="center" maxW="2xl">
            <Heading size="2xl" color="gray.900">
              Your Moving Journey Starts Here
            </Heading>
            <Text fontSize="xl" color="gray.600">
              From ZIP to ZIP, we'll help you find the perfect moving solution
            </Text>
          </VStack>

          {/* Search Form */}
          <Box bg="white" p={8} rounded="2xl" shadow="lg" w="full" maxW="2xl">
            <VStack spacing={6}>
              <Heading size="lg" color="gray.900">
                Plan Your Move
              </Heading>
              
              <Grid templateColumns="1fr 1fr" gap={4} w="full">
                <GridItem>
                  <FormControl>
                    <FormLabel>From ZIP Code</FormLabel>
                    <Input
                      placeholder="e.g., 10001"
                      value={searchData.zipFrom}
                      onChange={(e) => setSearchData({...searchData, zipFrom: e.target.value})}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel>To ZIP Code</FormLabel>
                    <Input
                      placeholder="e.g., 90210"
                      value={searchData.zipTo}
                      onChange={(e) => setSearchData({...searchData, zipTo: e.target.value})}
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              <Grid templateColumns="1fr 1fr" gap={4} w="full">
                <GridItem>
                  <FormControl>
                    <FormLabel>Move Date</FormLabel>
                    <Input
                      type="date"
                      value={searchData.moveDate}
                      onChange={(e) => setSearchData({...searchData, moveDate: e.target.value})}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel>What are you moving?</FormLabel>
                    <Select
                      placeholder="Select move type"
                      value={searchData.moveType}
                      onChange={(e) => setSearchData({...searchData, moveType: e.target.value})}
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="office">Office</option>
                      <option value="storage">Storage Unit</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>

              <Button
                size="lg"
                colorScheme="brand"
                w="full"
                onClick={handleSearch}
                isDisabled={!searchData.zipFrom || !searchData.zipTo}
              >
                Find Moving Options
              </Button>
            </VStack>
          </Box>

          {/* Role Selection */}
          <VStack spacing={6} w="full" maxW="4xl">
            <Heading size="lg" color="gray.900">
              Are you a service provider?
            </Heading>
            
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} w="full">
              <Button
                h="120px"
                flexDirection="column"
                gap={3}
                variant="outline"
                colorScheme="helper"
                onClick={() => handleRoleNavigation('helper')}
              >
                <Icon as={FaHandsHelping} boxSize={8} />
                <VStack spacing={1}>
                  <Text fontWeight="bold">Helper</Text>
                  <Text fontSize="sm" opacity={0.8}>Offer moving help</Text>
                </VStack>
              </Button>

              <Button
                h="120px"
                flexDirection="column"
                gap={3}
                variant="outline"
                colorScheme="truck"
                onClick={() => handleRoleNavigation('truck-owner')}
              >
                <Icon as={FaTruck} boxSize={8} />
                <VStack spacing={1}>
                  <Text fontWeight="bold">Truck Owner</Text>
                  <Text fontSize="sm" opacity={0.8}>Rent your truck</Text>
                </VStack>
              </Button>

              <Button
                h="120px"
                flexDirection="column"
                gap={3}
                variant="outline"
                colorScheme="brand"
                onClick={() => handleRoleNavigation('company')}
              >
                <Icon as={FaBuilding} boxSize={8} />
                <VStack spacing={1}>
                  <Text fontWeight="bold">Moving Company</Text>
                  <Text fontSize="sm" opacity={0.8}>List your services</Text>
                </VStack>
              </Button>

              <Button
                h="120px"
                flexDirection="column"
                gap={3}
                variant="outline"
                colorScheme="gray"
                onClick={() => handleRoleNavigation('agent')}
              >
                <Icon as={FaUserTie} boxSize={8} />
                <VStack spacing={1}>
                  <Text fontWeight="bold">Real Estate Agent</Text>
                  <Text fontSize="sm" opacity={0.8}>Help your clients</Text>
                </VStack>
              </Button>
            </Grid>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default LandingPage
