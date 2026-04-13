// ФАЙЛ ВРЕМЕННО ОТКЛЮЧЕН
// Весь код ниже закомментирован для деактивации компонента

/*// import React, { useState } from "react";
// import { Box, Heading, Text, VStack, HStack, Badge, Button, Card, CardBody, SimpleGrid, Stat, StatLabel, StatNumber, Progress, Avatar } from "@chakra-ui/react";
// import { CalendarIcon, TimeIcon, LocationIcon, StarIcon, CheckCircleIcon } from "@chakra-ui/icons";

// const DriverPage = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');

//   return (
//     <Box p={8} maxW="1200px" mx="auto">
//       <VStack spacing={6} align="stretch">
        {/* Header */
//         <Box>
//           <Heading size="lg" mb={2}>🚛 Панель водителя</Heading>
//           <Text color="gray.600">Управляйте вашими маршрутами и заказами</Text>
//         </Box>

//         {/* Stats Cards */}
//         <SimpleGrid columns={[1, 2, 4]} spacing={4}>
//           <Card>
//             <CardBody>
//               <Stat>
//                 <StatLabel>Активные заказы</StatLabel>
//                 <StatNumber fontSize="2xl" color="green.500">3</StatNumber>
//               </Stat>
//             </CardBody>
//           </Card>
//           <Card>
//             <CardBody>
//               <Stat>
//                 <StatLabel>Заработано сегодня</StatLabel>
//                 <StatNumber fontSize="2xl" color="blue.500">$450</StatNumber>
//               </Stat>
//             </CardBody>
//           </Card>
//           <Card>
//             <CardBody>
//               <Stat>
//                 <StatLabel>Рейтинг</StatLabel>
//                 <StatNumber fontSize="2xl" color="yellow.500">4.8⭐</StatNumber>
//               </Stat>
//             </CardBody>
//           </Card>
//           <Card>
//             <CardBody>
//               <Stat>
//                 <StatLabel>Пробег сегодня</StatLabel>
//                 <StatNumber fontSize="2xl" color="purple.500">127 миль</StatNumber>
//               </Stat>
//             </CardBody>
//           </Card>
//         </SimpleGrid>

//         {/* Navigation Tabs */}
//         <HStack spacing={4} borderBottom="1px solid" borderColor="gray.200" pb={2}>
//           {['dashboard', 'routes', 'schedule', 'earnings'].map((tab) => (
//             <Button
//               key={tab}
//               variant={activeTab === tab ? 'solid' : 'ghost'}
//               colorScheme="blue"
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab === 'dashboard' && '📊 Дашборд'}
//               {tab === 'routes' && '🗺 Маршруты'}
//               {tab === 'schedule' && '📅 Расписание'}
//               {tab === 'earnings' && '💰 Доходы'}
//             </Button>
//           ))}
//         </HStack>

//         {/* Content based on active tab */}
//         <Box>
//           {activeTab === 'dashboard' && (
//             <VStack spacing={4} align="stretch">
//               {/* Current Order */}
//               <Card>
//                 <CardBody>
//                   <Heading size="md" mb={3}>Текущий заказ</Heading>
//                   <VStack spacing={3} align="stretch">
//                     <HStack justify="space-between">
//                       <Text fontWeight="bold">Маршрут:</Text>
//                       <Text>90210 → 10001</Text>
//                     </HStack>
//                     <HStack justify="space-between">
//                       <Text fontWeight="bold">Время:</Text>
//                       <Text>14:00 - 18:00</Text>
//                     </HStack>
//                     <HStack justify="space-between">
//                       <Text fontWeight="bold">Клиент:</Text>
//                       <Text>Джон Смит</Text>
//                     </HStack>
//                     <HStack justify="space-between">
//                       <Text fontWeight="bold">Оплата:</Text>
//                       <Text color="green.500" fontWeight="bold">$150</Text>
//                     </HStack>
//                     <Button colorScheme="green" size="lg" mt={2}>
//                       📍 Начать маршрут
//                     </Button>
//                   </VStack>
//                 </CardBody>
//               </Card>

//               {/* Recent Routes */}
//               <Card>
//                 <CardBody>
//                   <Heading size="md" mb={3}>Последние маршруты</Heading>
//                   <VStack spacing={2}>
//                     {[/* eslint-disable-next-line */
//                       { from: '90210', to: '10001', price: '$150', status: 'completed' },
//                       { from: '10001', to: '90210', price: '$120', status: 'completed' },
//                       { from: '30301', to: '33101', price: '$180', status: 'in-progress' }
//                     ].map((route, index) => (
//                       <HStack key={index} p={3} bg="gray.50" rounded="md" justify="space-between">
//                         <VStack align="start" spacing={0}>
//                           <Text fontWeight="bold">{route.from} → {route.to}</Text>
//                           <Text fontSize="sm" color="gray.600">{route.price}</Text>
//                         </VStack>
//                         <Badge colorScheme={route.status === 'completed' ? 'green' : 'yellow'}>
//                           {route.status === 'completed' ? '✅ Завершен' : '🚛 В процессе'}
//                         </Badge>
//                       </HStack>
//                     ))}
//                   </VStack>
//                 </CardBody>
//               </Card>
//             </VStack>
//           )}

//           {activeTab === 'routes' && (
//             <Card>
//               <CardBody>
//                 <Heading size="md" mb={3}>Доступные маршруты</Heading>
//                 <Text color="gray.600" mb={4}>Выберите заказы которые соответствуют вашему маршруту</Text>
                
//                 <VStack spacing={3}>
//                   {[/* eslint-disable-next-line */
//                     { from: '90210', to: '10001', distance: '45 миль', price: '$150', time: '2 часа' },
//                     { from: '10001', to: '90210', distance: '45 миль', price: '$120', time: '2 часа' },
//                     { from: '30301', to: '33101', distance: '230 миль', price: '$280', time: '4 часа' }
//                   ].map((route, index) => (
//                     <Card key={index} variant="outline">
//                       <CardBody>
//                         <HStack justify="space-between" align="start">
//                           <VStack align="start" spacing={1}>
//                             <Text fontWeight="bold">{route.from} → {route.to}</Text>
//                             <Text fontSize="sm" color="gray.600">{route.distance} • {route.time}</Text>
//                           </VStack>
//                           <VStack align="end" spacing={1}>
//                             <Text fontSize="lg" fontWeight="bold" color="green.500">{route.price}</Text>
//                             <Button colorScheme="blue" size="sm">
//                               Принять
//                             </Button>
//                           </VStack>
//                         </HStack>
//                       </CardBody>
//                     </Card>
//                   ))}
//                 </VStack>
//               </CardBody>
//             </Card>
//           )}

//           {activeTab === 'schedule' && (
//             <Card>
//               <CardBody>
//                 <Heading size="md" mb={3}>Расписание</Heading>
//                 <Text color="gray.600" mb={4}>Управляйте вашим рабочим временем</Text>
                
//                 <VStack spacing={4} align="stretch">
//                   <Box>
//                     <Text fontWeight="bold" mb={2}>Сегодня, 9 апреля</Text>
//                     <VStack spacing={2}>
//                       <HStack justify="space-between" p={2} bg="green.50" rounded="md">
//                         <Text>14:00 - 18:00</Text>
//                         <Badge colorScheme="green">Занят</Badge>
//                       </HStack>
//                       <HStack justify="space-between" p={2} bg="gray.50" rounded="md">
//                         <Text>18:00 - 22:00</Text>
//                         <Badge colorScheme="gray">Свободно</Badge>
//                       </HStack>
//                     </VStack>
//                   </Box>
                  
//                   <Box>
//                     <Text fontWeight="bold" mb={2}>Завтра, 10 апреля</Text>
//                     <VStack spacing={2}>
//                       <HStack justify="space-between" p={2} bg="gray.50" rounded="md">
//                         <Text>09:00 - 13:00</Text>
//                         <Badge colorScheme="gray">Свободно</Badge>
//                       </HStack>
//                       <HStack justify="space-between" p={2} bg="gray.50" rounded="md">
//                         <Text>13:00 - 17:00</Text>
//                         <Badge colorScheme="gray">Свободно</Badge>
//                       </HStack>
//                     </VStack>
//                   </Box>
//                 </VStack>
//               </CardBody>
//             </Card>
//           )}

//           {activeTab === 'earnings' && (
//             <Card>
//               <CardBody>
//                 <Heading size="md" mb={3}>Доходы</Heading>
//                 <Text color="gray.600" mb={4}>Ваша финансовая статистика</Text>
                
//                 <VStack spacing={4} align="stretch">
//                   <Box>
//                     <Text fontWeight="bold" mb={2}>Эта неделя</Text>
//                     <HStack justify="space-between" mb={2}>
//                       <Text>Всего заказов:</Text>
//                       <Text fontWeight="bold">12</Text>
//                     </HStack>
//                     <HStack justify="space-between" mb={2}>
//                       <Text>Общий доход:</Text>
//                       <Text fontWeight="bold" color="green.500">$1,850</Text>
//                     </HStack>
//                     <HStack justify="space-between">
//                       <Text>Средний заказ:</Text>
//                       <Text fontWeight="bold">$154</Text>
//                     </HStack>
//                   </Box>
                  
//                   <Box>
//                     <Text fontWeight="bold" mb={2}>Этот месяц</Text>
//                     <HStack justify="space-between" mb={2}>
//                       <Text>Всего заказов:</Text>
//                       <Text fontWeight="bold">48</Text>
//                     </HStack>
//                     <HStack justify="space-between" mb={2}>
//                       <Text>Общий доход:</Text>
//                       <Text fontWeight="bold" color="green.500">$7,420</Text>
//                     </HStack>
//                     <HStack justify="space-between">
//                       <Text>Средний заказ:</Text>
//                       <Text fontWeight="bold">$155</Text>
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

// // export default DriverPage;
// */

// // Временный заглушка компонент
// const DriverPage = () => {
//   return (
//     <div>
//       <h1>DriverPage временно отключен</h1>
//       <p>Компонент будет активирован позже</p>
//     </div>
//   );
// };

// export default DriverPage;
