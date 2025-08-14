import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Grid,
  GridItem,
  Flex,
  Spacer,
  Card,
  CardBody,
  Avatar,
  Progress,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const HelperDashboard = () => {
  const navigate = useNavigate()

  const availableJobs = [
    {
      id: 1,
      client: 'Sarah Johnson',
      type: 'Apartment Move',
      date: '2025-08-20',
      time: '9:00 AM - 1:00 PM',
      location: 'Brooklyn, NY',
      distance: '2.3 miles from you',
      pay: '$120',
      difficulty: 'Medium',
    },
    {
      id: 2,
      client: 'Mike Chen',
      type: 'Loading Help',
      date: '2025-08-22',
      time: '2:00 PM - 4:00 PM',
      location: 'Manhattan, NY',
      distance: '5.1 miles from you',
      pay: '$80',
      difficulty: 'Easy',
    },
    {
      id: 3,
      client: 'Emma Davis',
      type: 'House Move',
      date: '2025-08-25',
      time: '8:00 AM - 6:00 PM',
      location: 'Queens, NY',
      distance: '1.8 miles from you',
      pay: '$350',
      difficulty: 'Hard',
    },
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'green'
      case 'Medium': return 'yellow'
      case 'Hard': return 'red'
      default: return 'gray'
    }
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="helper.500" color="white" py={4}>
        <Container maxW="7xl">
          <Flex align="center">
            <VStack align="start" spacing={0}>
              <Heading size="lg">🤝 Helper Dashboard</Heading>
              <Text opacity={0.9}>Welcome back, Alex!</Text>
            </VStack>
            <Spacer />
            <HStack>
              <Button variant="outline" colorScheme="whiteAlpha" onClick={() => navigate('/')}>
                Home
              </Button>
              <Avatar size="sm" name="Alex Helper" />
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        <Grid templateColumns="300px 1fr" gap={8}>
          {/* Stats Sidebar */}
          <GridItem>
            <VStack spacing={6}>
              {/* Profile Card */}
              <Card w="full">
                <CardBody>
                  <VStack spacing={4}>
                    <Avatar size="xl" name="Alex Helper" />
                    <VStack spacing={1}>
                      <Heading size="md">Alex Rodriguez</Heading>
                      <Badge colorScheme="helper">Verified Helper</Badge>
                      <HStack>
                        <Text fontSize="lg" fontWeight="bold">4.9</Text>
                        <Text color="yellow.500">⭐⭐⭐⭐⭐</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">127 completed jobs</Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* This Week Stats */}
              <Card w="full">
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Heading size="sm">This Week</Heading>
                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">Jobs Completed</Text>
                          <Text fontSize="sm" fontWeight="bold">3/5</Text>
                        </Flex>
                        <Progress value={60} colorScheme="helper" size="sm" />
                      </Box>
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">Earnings</Text>
                          <Text fontSize="sm" fontWeight="bold">$480</Text>
                        </Flex>
                        <Progress value={80} colorScheme="green" size="sm" />
                      </Box>
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">Hours Worked</Text>
                          <Text fontSize="sm" fontWeight="bold">18h</Text>
                        </Flex>
                        <Progress value={72} colorScheme="blue" size="sm" />
                      </Box>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* Main Content */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Quick Actions */}
              <Card>
                <CardBody>
                  <HStack spacing={4}>
                    <Button colorScheme="helper" size="lg">
                      📅 View Schedule
                    </Button>
                    <Button variant="outline" colorScheme="helper" size="lg">
                      💰 Earnings Report
                    </Button>
                    <Button variant="outline" colorScheme="helper" size="lg">
                      ⚙️ Settings
                    </Button>
                  </HStack>
                </CardBody>
              </Card>

              {/* Available Jobs */}
              <Box>
                <Heading size="lg" mb={4}>
                  🔍 Available Jobs Near You
                </Heading>
                <VStack spacing={4}>
                  {availableJobs.map((job) => (
                    <Card key={job.id} w="full" cursor="pointer" _hover={{ shadow: 'md' }}>
                      <CardBody>
                        <Grid templateColumns="1fr auto" gap={4}>
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <Heading size="md">{job.type}</Heading>
                              <Badge colorScheme={getDifficultyColor(job.difficulty)}>
                                {job.difficulty}
                              </Badge>
                            </HStack>
                            
                            <VStack align="start" spacing={1}>
                              <Text><strong>Client:</strong> {job.client}</Text>
                              <Text><strong>Date:</strong> {job.date}</Text>
                              <Text><strong>Time:</strong> {job.time}</Text>
                              <Text><strong>Location:</strong> {job.location}</Text>
                              <Text color="gray.600" fontSize="sm">{job.distance}</Text>
                            </VStack>
                          </VStack>
                          
                          <VStack justify="space-between" align="end">
                            <VStack align="end" spacing={1}>
                              <Text fontSize="2xl" fontWeight="bold" color="helper.500">
                                {job.pay}
                              </Text>
                              <Text fontSize="sm" color="gray.600">Total payment</Text>
                            </VStack>
                            <Button colorScheme="helper">
                              Accept Job
                            </Button>
                          </VStack>
                        </Grid>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}

export default HelperDashboard
