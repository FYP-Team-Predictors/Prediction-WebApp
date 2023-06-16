import React from "react";
import { Box, Text } from "@chakra-ui/react";

function PredictionCard({ title, value }) {
    return (
        <Box
            bg="#C1BCBC"
            borderRadius="lg"
            p={4}
            boxShadow="sm"
            mr={4}
            mb={4}
            minWidth="120px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Text fontSize="md" mb={2} textAlign="center">
                {title}
            </Text>
            <Text fontWeight="bold" fontSize="md">
                {value}
            </Text>
        </Box>
    );
}

export default PredictionCard;
