'use client';

import { Box, Text } from "@chakra-ui/react";

function Profile() {
  const userName = localStorage.getItem('userName')

  return (
    <Box className="container min-h-screen">
      <section className='px-3'>
        <Text className="mb-8" color="blue.600" fontSize="4xl">
          Welcome, {userName}
        </Text>
      </section>
    </Box>
  );
}

export default Profile;
