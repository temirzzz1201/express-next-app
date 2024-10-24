import { Box, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      as="footer"
      px="5"
      bg="gray.500"
      minH="10"
      className="flex items-center justify-center border-t-2 border-t-slate-600"
    >
      <Text textColor="white" fontSize="l">
        @ copyright 2024
      </Text>
    </Box>
  );
}
