import React, { useState } from "react";
import { Box, Heading, Text, VStack, HStack, Badge, Button, Card, CardBody, SimpleGrid, Stat, StatLabel, StatNumber, Progress, Avatar, Table, Thead, Tbody, Tr, Th, Td, Checkbox } from "@chakra-ui/react";
import { CalendarIcon, TimeIcon, LocationIcon, StarIcon, CheckCircleIcon, TruckIcon } from "@chakra-ui/icons";

const TruckPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for orders
  const orders = [
    { id: 1, route: 'Los Angeles → New York', truck: 'Truck #001', price: '$850', status: 'in-progress' },
    { id: 2, route: 'Chicago → Miami', truck: 'Truck #003', price: '$620', status: 'pending' },
    { id: 3, route: 'Houston → Seattle', truck: 'Truck #005', price: '$940', status: 'scheduled' }
  ];

  // Mock data for trucks
  const trucks = [
    { id: 1, name: 'Грузовик #001', type: 'Легкий', capacity: '1.5т', status: 'in-use' },
    { id: 2, name: 'Грузовик #002', type: 'Средний', capacity: '2.5т', status: 'available' },
    { id: 3, name: 'Грузовик #003', type: 'Тяжелый', capacity: '5т', status: 'maintenance' },
    { id: 4, name: 'Грузовик #004', type: 'Средний', capacity: '3т', status: 'available' }
  ];

  // Mock data for new orders
  const newOrders = [
    { id: 1, from: '90210', to: '10001', distance: '45 миль', weight: '2т', price: '$350', urgent: true },
    { id: 2, from: '30301', to: '33101', distance: '120 миль', weight: '1.5т', price: '$280', urgent: false },
    { id: 3, from: '77001', to: '75001', distance: '200 миль', weight: '4т', price: '$650', urgent: false }
  ];

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>🚛 Панель грузовиков</Heading>
          <Text color="gray.600">Управляйте парком и заказами на транспортировку</Text>
        </Box>

//         {/* Stats Cards */}
//         <SimpleGrid columns={[1, 2, 4]} spacing={4}>
//           <Card>
//             <CardBody>
//               <Stat>
//                 <StatLabel>Доступно грузовиков</StatLabel>
//                 <StatNumber fontSize="2xl" color="green.500">8</StatNumber>
//               </Stat>
//             </CardBody>
//           </Card>
//           <Card>
//             <CardBody>
//               <Stat>
//                 <StatLabel>Активные заказы</StatLabel>
//                 <StatNumber fontSize="2xl" color="blue.500">5</StatNumber>
//               </Stat>
//             </CardBody>
//           </Card>
//           <Card>
//             <CardBody>
//               <Stat>
//                 <StatLabel>Средний рейтинг</StatLabel>
//                 <StatNumber fontSize="2xl" color="yellow.500">4.6⭐</StatNumber>
//               </Stat>
//             </CardBody>
//           </Card>
//           <Card>
//             <CardBody>
//               <Stat>
//                 <StatLabel>Доход сегодня</StatLabel>
//                 <StatNumber fontSize="2xl" color="purple.500">$1,200</StatNumber>
//               </Stat>
//             </CardBody>
//           </Card>
//         </SimpleGrid>

//         {/* Navigation Tabs */}
//         <HStack spacing={4} borderBottom="1px solid" borderColor="gray.200" pb={2}>
//           {['dashboard', 'fleet', 'orders', 'earnings'].map((tab) => (
//             <Button
//               key={tab}
//               variant={activeTab === tab ? 'solid' : 'ghost'}
//               colorScheme="blue"
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab === 'dashboard' && '📊 Дашборд'}
//               {tab === 'fleet' && '🚛 Автопарк'}
//               {tab === 'orders' && '📦 Заказы'}
//               {tab === 'earnings' && '💰 Доходы'}
//             </Button>
//           ))}
//         </HStack>

//         {/* Content based on active tab */}
//         <Box>
//           {activeTab === 'dashboard' && (
//             <VStack spacing={4} align="stretch">
//               {/* Current Orders */}
//               <Card>
//                 <CardBody>
//                   <Heading size="md" mb={3}>Текущие заказы</Heading>
//                   <VStack spacing={2}>
//                     {[/* orders array */].map((order) => (
//                       <HStack key={order.id} p={3} bg="gray.50" rounded="md" justify="space-between">
//                         <VStack align="start" spacing={1}>
//                           <Text fontWeight="bold">{order.route}</Text>
//                           <Text fontSize="sm" color="gray.600">{order.truck}</Text>
//                           <Text fontSize="sm" color="gray.600">{order.price}</Text>
//                         </VStack>
//                         <Badge colorScheme={
//                           order.status === 'in-progress' ? 'green' :
//                           order.status === 'pending' ? 'yellow' : 'blue'
//                         }>
//                           {order.status === 'in-progress' && '🚛 В пути'}
//                           {order.status === 'pending' && '⏳ Ожидание'}
//                           {order.status === 'scheduled' && '📅 Запланирован'}
//                         </Badge>
//                       </HStack>
//                     ))}
//                   </VStack>
//                 </CardBody>
//               </Card>

//               {/* Quick Stats */}
//               <SimpleGrid columns={[1, 2]} spacing={4}>
//                 <Card>
//                   <CardBody>
//                     <Heading size="sm" mb={2}>Загрузка парка</Heading>
//                     <VStack spacing={2}>
//                       <HStack justify="space-between">
//                         <Text>Занято:</Text>
//                         <Text fontWeight="bold" color="green.500">5/8</Text>
//                       </HStack>
//                       <Progress value={62.5} colorScheme="green" />
//                       <Text fontSize="sm" color="gray.600">62.5% utilized</Text>
//                     </VStack>
//                   </CardBody>
//                 </Card>
//                 <Card>
//                   <CardBody>
//                     <Heading size="sm" mb={2}>Типы грузовиков</Heading>
//                     <VStack spacing={2}>
//                       <HStack justify="space-between">
//                         <Text>Легкие (&lt; 1т):</Text>
//                         <Text fontWeight="bold">3</Text>
//                       </HStack>
//                       <HStack justify="space-between">
//                         <Text>Средние (1-3т):</Text>
//                         <Text fontWeight="bold">4</Text>
//                       </HStack>
//                       <HStack justify="space-between">
//                         <Text>Тяжелые (&gt;3т):</Text>
//                         <Text fontWeight="bold">1</Text>
//                       </HStack>
//                     </VStack>
//                   </CardBody>
//                 </Card>
//               </SimpleGrid>
//             </VStack>
//           )}

//           {activeTab === 'fleet' && (
//             <Card>
//               <CardBody>
//                 <Heading size="md" mb={3}>Автопарк</Heading>
//                 <Text color="gray.600" mb={4}>Управляйте вашим грузовиком парком</Text>
                
//                 <Table variant="simple">
//                   <Thead>
//                     <Tr>
//                       <Th>Грузовик</Th>
//                       <Th>Тип</Th>
//                       <Th>Грузоподъемность</Th>
//                       <Th>Статус</Th>
//                       <Th>Действия</Th>
//                     </Tr>
//                   </Thead>
//                   <Tbody>
//                     {[/* trucks array */].map((truck) => (
//                       <Tr key={truck.id}>
//                         <Td fontWeight="bold">{truck.name}</Td>
//                         <Td>{truck.type}</Td>
//                         <Td>{truck.capacity}</Td>
//                         <Td>
//                           <Badge colorScheme={
//                             truck.status === 'available' ? 'green' :
//                             truck.status === 'in-use' ? 'blue' : 'yellow'
//                           }>
//                             {truck.status === 'available' && '✅ Доступен'}
//                             {truck.status === 'in-use' && '🚛 В использовании'}
//                             {truck.status === 'maintenance' && '🔧 Обслуживание'}
//                           </Badge>
//                         </Td>
//                         <Td>
//                           <Button size="sm" colorScheme="blue" mr={2}>Редактировать</Button>
//                           <Button size="sm" colorScheme="red">Удалить</Button>
//                         </Td>
//                       </Tr>
//                     ))}
//                   </Tbody>
//                 </Table>
//               </CardBody>
//             </Card>
//           )}

//           {activeTab === 'orders' && (
//             <VStack spacing={4} align="stretch">
//               <Card>
//                 <CardBody>
//                   <Heading size="md" mb={3}>Новые заказы</Heading>
//                   <Text color="gray.600" mb={4}>Принимайте новые заказы на транспортировку</Text>
                  
//                   <VStack spacing={3}>
//                     {[/* orders array */].map((order) => (
//                       <Card key={order.id} variant="outline">
//                         <CardBody>
//                           <HStack justify="space-between" align="start">
//                             <VStack align="start" spacing={1}>
//                               <Text fontWeight="bold">{order.from} → {order.to}</Text>
//                               <Text fontSize="sm" color="gray.600">{order.distance} • {order.weight}</Text>
//                               {order.urgent && <Badge colorScheme="red" size="sm">🚨 Срочно</Badge>}
//                             </VStack>
//                             <VStack align="end" spacing={1}>
//                               <Text fontSize="lg" fontWeight="bold" color="green.500">{order.price}</Text>
//                               <Button colorScheme="green" size="sm">
//                                 Принять заказ
//                               </Button>
//                             </VStack>
//                           </HStack>
//                         </CardBody>
//                       </Card>
//                     ))}
//                   </VStack>
//                 </CardBody>
//               </Card>

//               <Card>
//                 <CardBody>
//                   <Heading size="md" mb={3}>Фильтры заказов</Heading>
//                   <VStack spacing={3} align="stretch">
//                     <Box>
//                       <Text fontWeight="bold" mb={2}>Тип грузовика</Text>
//                       <VStack spacing={2} align="start">
//                         <Checkbox>Легкие (&lt; 1т)</Checkbox>
//                         <Checkbox>Средние (1-3т)</Checkbox>
//                         <Checkbox>Тяжелые (&gt;3т)</Checkbox>
//                       </VStack>
//                     </Box>
                    
//                     <Box>
//                       <Text fontWeight="bold" mb={2}>Расстояние</Text>
//                       <VStack spacing={2} align="start">
//                         <Checkbox>До 50 миль</Checkbox>
//                         <Checkbox>50-200 миль</Checkbox>
//                         <Checkbox>200+ миль</Checkbox>
//                       </VStack>
//                     </Box>
                    
//                     <Box>
//                       <Text fontWeight="bold" mb={2}>Срочность</Text>
//                       <VStack spacing={2} align="start">
//                         <Checkbox>Только срочные</Checkbox>
//                         <Checkbox>Все заказы</Checkbox>
//                       </VStack>
//                     </Box>
//                   </VStack>
//                 </CardBody>
//               </Card>
//             </VStack>
//           )}

//           {activeTab === 'earnings' && (
//             <Card>
//               <CardBody>
//                 <Heading size="md" mb={3}>Доходы автопарка</Heading>
//                 <Text color="gray.600" mb={4}>Финансовая статистика вашего парка</Text>
                
//                 <VStack spacing={4} align="stretch">
//                   <Box>
//                     <Text fontWeight="bold" mb={2}>Сегодня</Text>
//                     <HStack justify="space-between" mb={2}>
//                       <Text>Активных грузовиков:</Text>
//                       <Text fontWeight="bold">5</Text>
//                     </HStack>
//                     <HStack justify="space-between" mb={2}>
//                       <Text>Выполнено заказов:</Text>
//                       <Text fontWeight="bold">3</Text>
//                     </HStack>
//                     <HStack justify="space-between">
//                       <Text>Общий доход:</Text>
//                       <Text fontWeight="bold" color="green.500">$1,200</Text>
//                     </HStack>
//                   </Box>
                  
//                   <Box>
//                     <Text fontWeight="bold" mb={2}>Эта неделя</Text>
//                     <HStack justify="space-between" mb={2}>
//                       <Text>Заказов:</Text>
//                       <Text fontWeight="bold">18</Text>
//                     </HStack>
//                     <HStack justify="space-between" mb={2}>
//                       <Text>Доход:</Text>
//                       <Text fontWeight="bold" color="green.500">$8,450</Text>
//                     </HStack>
//                     <HStack justify="space-between">
//                       <Text>Средний заказ:</Text>
//                       <Text fontWeight="bold">$469</Text>
//                     </HStack>
//                   </Box>
                  
//                   <Box>
//                     <Text fontWeight="bold" mb={2}>Этот месяц</Text>
//                     <HStack justify="space-between" mb={2}>
//                       <Text>Заказов:</Text>
//                       <Text fontWeight="bold">72</Text>
//                     </HStack>
//                     <HStack justify="space-between" mb={2}>
//                       <Text>Доход:</Text>
//                       <Text fontWeight="bold" color="green.500">$34,200</Text>
//                     </HStack>
//                     <HStack justify="space-between">
//                       <Text>Средний заказ:</Text>
//                       <Text fontWeight="bold">$475</Text>
//                     </HStack>
//                   </Box>
//                 </VStack>
//               </CardBody>
//             </Card>
//           )}
//         </Box>
//       </VStack>
//     </Box>
//   );
// };

// export default TruckPage;
