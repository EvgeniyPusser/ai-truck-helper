import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  Link,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";

const contactEmail = "hello@holymove.ai";

const PrivacyPolicyPage = () => {
  return (
    <Box minH="100vh" bg="gray.50" color="gray.800">
      <Navbar />

      <Container maxW="900px" pt={{ base: 32, md: 36 }} pb={16}>
        <VStack align="stretch" spacing={8}>
          <Box>
            <Text color="brand.600" fontWeight="bold" letterSpacing="0.08em" fontSize="sm">
              HOLY MOVE
            </Text>
            <Heading as="h1" size="2xl" mt={3} color="navy.600">
              Privacy Policy
            </Heading>
            <Text color="gray.500" mt={3}>
              Last updated: May 31, 2026
            </Text>
          </Box>

          <Stack spacing={6} bg="white" border="1px solid" borderColor="gray.200" borderRadius="8px" p={{ base: 5, md: 8 }}>
            <Text>
              Holy Move respects your privacy. This Privacy Policy explains what
              information we collect and how we use it when you use Holy Move,
              including features connected to Meta platforms.
            </Text>

            <Box>
              <Heading as="h2" size="md" mb={3} color="navy.600">
                Information We Collect
              </Heading>
              <Text mb={3}>We may collect the following information:</Text>
              <UnorderedList spacing={2} pl={4}>
                <ListItem>Your name and contact details, such as email address or phone number.</ListItem>
                <ListItem>Information you choose to provide about a moving request.</ListItem>
                <ListItem>Meta account information needed to connect or operate Holy Move features.</ListItem>
                <ListItem>Basic technical information needed to keep the service working and secure.</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="md" mb={3} color="navy.600">
                How We Use Information
              </Heading>
              <Text>
                We use this information only to operate, support, and improve
                Holy Move, respond to requests, provide moving-related services,
                and maintain integrations that you choose to use.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="md" mb={3} color="navy.600">
                Sharing Information
              </Heading>
              <Text>
                We do not sell user data. We do not share personal information
                with third parties for their own marketing purposes. We may share
                information only when needed to provide Holy Move services,
                comply with law, protect our rights, or operate trusted service
                providers under appropriate safeguards.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="md" mb={3} color="navy.600">
                Contact
              </Heading>
              <Text>
                If you have questions about this Privacy Policy or want to
                request access, correction, or deletion of your information,
                contact us at{" "}
                <Link href={`mailto:${contactEmail}`} color="brand.600" fontWeight="bold">
                  {contactEmail}
                </Link>
                .
              </Text>
            </Box>
          </Stack>

          <Button as={RouterLink} to="/" alignSelf="flex-start" colorScheme="orange">
            Back to Holy Move
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;
