import React, { useState } from "react";
import { Box, Heading, Text, VStack, HStack, Badge, Button, Card, CardBody, SimpleGrid, Stat, StatLabel, StatNumber, Progress, Avatar, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Input, Textarea } from "@chakra-ui/react";
import { CalendarIcon, TimeIcon, LocationIcon, StarIcon, CheckCircleIcon, EditIcon } from "@chakra-ui/icons";

const HelperPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>💪 Панель грузчика</Heading>
          <Text color="gray.600">Управляйте вашими заказами и графиком работы</Text>
        </Box>

        {/* Stats Cards */}
        <SimpleGrid columns={[1, 2, 4]} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Активные заказы</StatLabel>
                <StatNumber fontSize="2xl" color="green.500">2</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Заработано сегодня</StatLabel>
                <StatNumber fontSize="2xl" color="blue.500">$180</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Рейтинг</StatLabel>
                <StatNumber fontSize="2xl" color="yellow.500">4.7⭐</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Часов сегодня</StatLabel>
                <StatNumber fontSize="2xl" color="purple.500">8</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Navigation Tabs */}
        <HStack spacing={4} borderBottom="1px solid" borderColor="gray.200" pb={2}>
          {['dashboard', 'jobs', 'schedule', 'profile'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'solid' : 'ghost'}
              colorScheme="blue"
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'dashboard' && '📊 Дашборд'}
              {tab === 'jobs' && '💼 Заказы'}
              {tab === 'schedule' && '📅 График'}
              {tab === 'profile' && '👤 Профиль'}
            </Button>
          ))}
        </HStack>

        {/* Content based on active tab */}
        <Box>
          {activeTab === 'dashboard' && (
            <VStack spacing={4} align="stretch">
              {/* Current Job */}
              <Card>
                <CardBody>
                  <Heading size="md" mb={3}>Текущий заказ</Heading>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="bold">Локация:</Text>
                      <Text>90210 → 10001</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="bold">Время:</Text>
                      <Text>14:00 - 18:00</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="bold">Клиент:</Text>
                      <Text>Мария Джонсон</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="bold">Оплата:</Text>
                      <Text color="green.500" fontWeight="bold">$90</Text>
                    </HStack>
                    <Button colorScheme="green" size="lg" mt={2}>
                      ✅ Начать работу
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Available Jobs */}
              <Card>
                <CardBody>
                  <Heading size="md" mb={3}>Доступные заказы</Heading>
                  <Text color="gray.600" mb={4}>Выберите заказы которые вам подходят</Text>
                  
                  <VStack spacing={3}>
                    {[/* Add jobs data here */].map((job) => (
                      <Card key={job.id} variant="outline">
                        <CardBody>
                          <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold">{job.location}</Text>
                              <Text fontSize="sm" color="gray.600">{job.hours} часов • {job.rate}</Text>
                              {job.urgent && <Badge colorScheme="red" size="sm">🚨 Срочно</Badge>}
                            </VStack>
                            <VStack align="end" spacing={1}>
                              <Text fontSize="lg" fontWeight="bold" color="green.500">{job.total}</Text>
                              <Button colorScheme="blue" size="sm">
                                Принять
                              </Button>
                            </VStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          )}

          {activeTab === 'jobs' && (
            <VStack spacing={4} align="stretch">
              <Card>
                <CardBody>
                  <Heading size="md" mb={3}>История заказов</Heading>
                  <Text color="gray.600" mb={4}>Ваша история работы</Text>
                  
                  <VStack spacing={2}>
                    {[/* Add jobs history data here */].map((job) => (
                      <HStack key={job.id} p={3} bg="gray.50" rounded="md" justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">{job.location}</Text>
                          <Text fontSize="sm" color="gray.600">{job.date} • {job.hours} часов</Text>
                          <Text fontSize="sm" color="gray.600">{job.rate}</Text>
                        </VStack>
                        <VStack align="end" spacing={1}>
                          <Text fontSize="lg" fontWeight="bold" color="green.500">{job.total}</Text>
                          <Badge colorScheme="green">✅ Завершен</Badge>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Heading size="md" mb={3}>Фильтры заказов</Heading>
                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontWeight="bold" mb={2}>Ставка</Text>
                      <VStack spacing={2} align="start">
                        <Checkbox>$20-25/час</Checkbox>
                        <Checkbox>$25-30/час</Checkbox>
                        <Checkbox>$30+/час</Checkbox>
                      </VStack>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold" mb={2}>Длительность</Text>
                      <VStack spacing={2} align="start">
                        <Checkbox>До 3 часов</Checkbox>
                        <Checkbox>3-6 часов</Checkbox>
                        <Checkbox>6+ часов</Checkbox>
                      </VStack>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold" mb={2}>Срочность</Text>
                      <VStack spacing={2} align="start">
                        <Checkbox>Только срочные</Checkbox>
                        <Checkbox>Все заказы</Checkbox>
                      </VStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          )}

          {activeTab === 'schedule' && (
            <Card>
              <CardBody>
                <Heading size="md" mb={3}>Ваш график</Heading>
                <Text color="gray.600" mb={4}>Управляйте вашим рабочим временем</Text>
                
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="bold" mb={2}>Сегодня, 9 апреля</Text>
                    <VStack spacing={2}>
                      <HStack justify="space-between" p={2} bg="green.50" rounded="md">
                        <Text>14:00 - 18:00</Text>
                        <Badge colorScheme="green">Занят</Badge>
                      </HStack>
                      <HStack justify="space-between" p={2} bg="gray.50" rounded="md">
                        <Text>18:00 - 22:00</Text>
                        <Badge colorScheme="gray">Свободно</Badge>
                      </HStack>
                    </VStack>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" mb={2}>Завтра, 10 апреля</Text>
                    <VStack spacing={2}>
                      <HStack justify="space-between" p={2} bg="gray.50" rounded="md">
                        <Text>09:00 - 13:00</Text>
                        <Badge colorScheme="gray">Свободно</Badge>
                      </HStack>
                      <HStack justify="space-between" p={2} bg="gray.50" rounded="md">
                        <Text>13:00 - 17:00</Text>
                        <Badge colorScheme="gray">Свободно</Badge>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          )}

          {activeTab === 'profile' && (
            <VStack spacing={4} align="stretch">
              <Card>
                <CardBody>
                  <Heading size="md" mb={3}>Мой профиль</Heading>
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={4}>
                      <Avatar size="xl" src="https://bit.ly/broken-link" />
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xl" fontWeight="bold">Алексей Петров</Text>
                        <Text color="gray.600">Грузчик</Text>
                        <HStack>
                          <Badge colorScheme="green">✅ Верифицирован</Badge>
                          <Badge colorScheme="blue">4.7⭐</Badge>
                        </HStack>
                      </VStack>
                    </HStack>
                    
                    <VStack spacing={3}>
                      <Box>
                        <Text fontWeight="bold" mb={2}>Контактная информация</Text>
                        <VStack spacing={2} align="start">
                          <Text>📞 +1 (555) 123-4567</Text>
                          <Text>📧 alex.petrov@example.com</Text>
                          <Text>📍 Лос-Анджелес, Калифорния</Text>
                        </VStack>
                      </Box>
                      
                      <Box>
                        <Text fontWeight="bold" mb={2}>Навыки</Text>
                        <VStack spacing={2} align="start">
                          <Badge colorScheme="blue">🏋️ Тяжелые грузы</Badge>
                          <Badge colorScheme="blue">📦 Упаковка</Badge>
                          <Badge colorScheme="blue">🚛 Загрузка/выгрузка</Badge>
                          <Badge colorScheme="blue">🔧 Сборка мебели</Badge>
                        </VStack>
                      </Box>
                      
                      <Box>
                        <Text fontWeight="bold" mb={2}>О себе</Text>
                        <Text color="gray.600">
                          Опыт работы грузчиком 5 лет. Работаю быстро и аккуратно. 
                          Есть физическая подготовка для работы с тяжелыми грузами.
                          Всегда пунктуален и ответственен.
                        </Text>
                      </Box>
                      
                      <Button colorScheme="blue" size="lg">
                        ✏️ Редактировать профиль
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default HelperPage;
