import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { API_URL } from "../api/config";

const AdminPage = () => {
  const [password, setPassword] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <Container maxW="520px">
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
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminPage;

