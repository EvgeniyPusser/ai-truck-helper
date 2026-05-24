import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Switch,
  Table,
  Tbody,
  Td,
  Textarea,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { API_URL } from "../api/config";

const initialPriceSample = {
  providerName: "",
  providerType: "moving_company",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  pickupZip: "",
  dropoffZip: "",
  moveDate: "",
  quoteDate: new Date().toISOString().slice(0, 10),
  quotedPrice: "",
  depositAmount: "",
  distanceMiles: "",
  rooms: "1",
  volume: "",
  helpers: "",
  estimatedHours: "",
  serviceLevel: "labor_and_truck",
  includedServices: "",
  notes: "",
  source: "partner_outreach",
  status: "quoted",
};

const formatMoney = (value) => {
  if (value == null) return "n/a";
  return `$${Math.round(Number(value)).toLocaleString()}`;
};

const AdminPage = () => {
  const [password, setPassword] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceSample, setPriceSample] = useState(initialPriceSample);
  const [priceSamples, setPriceSamples] = useState([]);
  const [priceStats, setPriceStats] = useState(null);
  const [priceStatus, setPriceStatus] = useState("");
  const [priceLoading, setPriceLoading] = useState(false);

  const updatePersistence = async (nextValue) => {
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch(`${API_URL}/api/admin/persistence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": password,
        },
        body: JSON.stringify({ saveHelperRequests: nextValue }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      setEnabled(Boolean(data.saveHelperRequests));
      setStatus(data.saveHelperRequests ? "Database writes enabled" : "Database writes disabled");
    } catch (error) {
      setStatus(error.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const loadPriceSamples = async () => {
    setPriceLoading(true);
    setPriceStatus("");

    try {
      const res = await fetch(`${API_URL}/api/admin/price-samples`, {
        headers: {
          "x-admin-token": password,
        },
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      setPriceSamples(data.samples || []);
      setPriceStats(data.stats || null);
      setPriceStatus(`Loaded ${data.samples?.length || 0} price records`);
    } catch (error) {
      setPriceStatus(error.message || "Request failed");
    } finally {
      setPriceLoading(false);
    }
  };

  const updatePriceField = (field, value) => {
    setPriceSample((current) => ({ ...current, [field]: value }));
  };

  const savePriceSample = async (event) => {
    event.preventDefault();
    setPriceLoading(true);
    setPriceStatus("");

    try {
      const res = await fetch(`${API_URL}/api/admin/price-samples`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": password,
        },
        body: JSON.stringify(priceSample),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.errors?.join(", ") || data?.error || `HTTP ${res.status}`);
      }

      setPriceSample({
        ...initialPriceSample,
        quoteDate: new Date().toISOString().slice(0, 10),
      });
      setPriceStatus("Price sample saved");
      await loadPriceSamples();
    } catch (error) {
      setPriceStatus(error.message || "Request failed");
    } finally {
      setPriceLoading(false);
    }
  };

  const inputProps = {
    size: "sm",
    borderRadius: "8px",
    bg: "white",
  };

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <Container maxW="1180px">
        <VStack align="stretch" spacing={5} bg="white" border="1px solid" borderColor="gray.200" p={6} borderRadius="lg">
          <Heading size="md">Admin</Heading>

          <FormControl>
            <FormLabel>Admin password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel mb="0">Save helper requests</FormLabel>
            <Switch
              isChecked={enabled}
              isDisabled={!password || loading}
              onChange={(event) => updatePersistence(event.target.checked)}
            />
          </FormControl>

          <Button
            colorScheme="orange"
            isDisabled={!password || loading}
            isLoading={loading}
            onClick={() => updatePersistence(enabled)}
          >
            Apply
          </Button>

          {status && <Text color={status.includes("failed") || status.includes("Unauthorized") ? "red.600" : "gray.700"}>{status}</Text>}

          <Divider />

          <Grid templateColumns={["1fr", null, "1.05fr 1.25fr"]} gap={6} alignItems="start">
            <GridItem>
              <VStack as="form" align="stretch" spacing={4} onSubmit={savePriceSample}>
                <Heading size="sm">Real price sample</Heading>

                <SimpleGrid columns={[1, 2]} spacing={3}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Provider</FormLabel>
                    <Input {...inputProps} value={priceSample.providerName} onChange={(event) => updatePriceField("providerName", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Provider type</FormLabel>
                    <Select {...inputProps} value={priceSample.providerType} onChange={(event) => updatePriceField("providerType", event.target.value)}>
                      <option value="moving_company">Moving company</option>
                      <option value="loaders">Loaders</option>
                      <option value="drivers">Drivers</option>
                      <option value="truck_rental">Truck rental</option>
                      <option value="broker">Broker</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Contact name</FormLabel>
                    <Input {...inputProps} value={priceSample.contactName} onChange={(event) => updatePriceField("contactName", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Phone</FormLabel>
                    <Input {...inputProps} value={priceSample.contactPhone} onChange={(event) => updatePriceField("contactPhone", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Email</FormLabel>
                    <Input {...inputProps} type="email" value={priceSample.contactEmail} onChange={(event) => updatePriceField("contactEmail", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Service level</FormLabel>
                    <Select {...inputProps} value={priceSample.serviceLevel} onChange={(event) => updatePriceField("serviceLevel", event.target.value)}>
                      <option value="labor_only">Labor only</option>
                      <option value="labor_and_truck">Labor and truck</option>
                      <option value="full_service">Full service</option>
                      <option value="truck_only">Truck only</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Pickup ZIP</FormLabel>
                    <Input {...inputProps} inputMode="numeric" pattern="\d{5}" value={priceSample.pickupZip} onChange={(event) => updatePriceField("pickupZip", event.target.value)} />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Drop-off ZIP</FormLabel>
                    <Input {...inputProps} inputMode="numeric" pattern="\d{5}" value={priceSample.dropoffZip} onChange={(event) => updatePriceField("dropoffZip", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Move date</FormLabel>
                    <Input {...inputProps} type="date" value={priceSample.moveDate} onChange={(event) => updatePriceField("moveDate", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Quote date</FormLabel>
                    <Input {...inputProps} type="date" value={priceSample.quoteDate} onChange={(event) => updatePriceField("quoteDate", event.target.value)} />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Quoted price</FormLabel>
                    <Input {...inputProps} type="number" min="1" value={priceSample.quotedPrice} onChange={(event) => updatePriceField("quotedPrice", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Deposit</FormLabel>
                    <Input {...inputProps} type="number" min="0" value={priceSample.depositAmount} onChange={(event) => updatePriceField("depositAmount", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Distance mi</FormLabel>
                    <Input {...inputProps} type="number" min="0" value={priceSample.distanceMiles} onChange={(event) => updatePriceField("distanceMiles", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Rooms</FormLabel>
                    <Input {...inputProps} type="number" min="0" value={priceSample.rooms} onChange={(event) => updatePriceField("rooms", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Volume</FormLabel>
                    <Input {...inputProps} type="number" min="0" value={priceSample.volume} onChange={(event) => updatePriceField("volume", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Helpers</FormLabel>
                    <Input {...inputProps} type="number" min="0" value={priceSample.helpers} onChange={(event) => updatePriceField("helpers", event.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Estimated hours</FormLabel>
                    <Input {...inputProps} type="number" min="0" value={priceSample.estimatedHours} onChange={(event) => updatePriceField("estimatedHours", event.target.value)} />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel fontSize="sm">Included services</FormLabel>
                  <Input {...inputProps} value={priceSample.includedServices} onChange={(event) => updatePriceField("includedServices", event.target.value)} placeholder="packing, stairs, long carry" />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Notes</FormLabel>
                  <Textarea size="sm" borderRadius="8px" value={priceSample.notes} onChange={(event) => updatePriceField("notes", event.target.value)} />
                </FormControl>

                <HStack>
                  <Button type="submit" colorScheme="orange" isDisabled={!password || priceLoading} isLoading={priceLoading}>
                    Save price
                  </Button>
                  <Button type="button" variant="outline" isDisabled={!password || priceLoading} onClick={loadPriceSamples}>
                    Refresh
                  </Button>
                </HStack>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Heading size="sm">Real price base</Heading>
                {priceStats && (
                  <SimpleGrid columns={[2, 4]} spacing={3}>
                    <Box bg="gray.50" p={3} borderRadius="8px">
                      <Text fontSize="xs" color="gray.500">Records</Text>
                      <Text fontWeight="bold">{priceStats.count}</Text>
                    </Box>
                    <Box bg="gray.50" p={3} borderRadius="8px">
                      <Text fontSize="xs" color="gray.500">Average</Text>
                      <Text fontWeight="bold">{formatMoney(priceStats.avgQuotedPrice)}</Text>
                    </Box>
                    <Box bg="gray.50" p={3} borderRadius="8px">
                      <Text fontSize="xs" color="gray.500">Min</Text>
                      <Text fontWeight="bold">{formatMoney(priceStats.minQuotedPrice)}</Text>
                    </Box>
                    <Box bg="gray.50" p={3} borderRadius="8px">
                      <Text fontSize="xs" color="gray.500">Max</Text>
                      <Text fontWeight="bold">{formatMoney(priceStats.maxQuotedPrice)}</Text>
                    </Box>
                  </SimpleGrid>
                )}

                {priceStatus && (
                  <Text color={priceStatus.includes("failed") || priceStatus.includes("Unauthorized") || priceStatus.includes("required") ? "red.600" : "gray.700"}>
                    {priceStatus}
                  </Text>
                )}

                <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="8px">
                  <Table size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Provider</Th>
                        <Th>Route</Th>
                        <Th isNumeric>Price</Th>
                        <Th>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {priceSamples.map((sample) => (
                        <Tr key={sample._id}>
                          <Td>
                            <Text fontWeight="semibold">{sample.providerName}</Text>
                            <Text fontSize="xs" color="gray.500">{sample.providerType}</Text>
                          </Td>
                          <Td>
                            {sample.pickupZip} to {sample.dropoffZip}
                          </Td>
                          <Td isNumeric>{formatMoney(sample.quotedPrice)}</Td>
                          <Td>{sample.quoteDate}</Td>
                        </Tr>
                      ))}
                      {!priceSamples.length && (
                        <Tr>
                          <Td colSpan={4}>
                            <Text color="gray.500" py={4} textAlign="center">No price records loaded.</Text>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminPage;
