import Link from 'next/link'
import {Avatar, Flex, Heading, Icon, Text} from '@chakra-ui/react'
import { FiHome, FiPieChart, FiDollarSign } from 'react-icons/fi'
import React from "react";

function Sidebar({ activePage }) {
    return (
        <Flex
            w={["100%", "100%", "15%", "25%", "20%"]}
            flexDir="column"
            alignItems="center"
            backgroundColor="#020202"
            color="#fff"
        >
            <Flex
                flexDir="column"
                h={[null, null, "100vh"]}
                justifyContent="space-between"
            >
                <Flex
                    flexDir="column"
                    as="nav"
                >
                    <Flex flexDir="column" alignItems="center" mb={1} mt={5}>
                        <Avatar my={2} src="avatar-1.jpg" boxSize={["40px", "60px", "80px"]}/>
                    </Flex>
                    <Heading
                        mt={1}
                        mb={[10, 25, 50]}
                        fontSize={["4xl", "4xl", "2xl", "3xl", "4xl",]}
                        alignSelf="center"
                        letterSpacing="tight"
                    >
                        Predictor
                    </Heading>
                    <Flex
                        flexDir={["row", "row", "column", "column", "column"]}
                        align={["center", "center", "center", "flex-start", "flex-start"]}
                        wrap={["wrap", "wrap", "nowrap", "nowrap", "nowrap"]}
                        justifyContent="center"
                    >
                        <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                            <Link href="/dashboard" display={["none", "none", "flex", "flex", "flex"]}>
                                <Icon as={FiHome} fontSize="2xl" className={activePage === 'dashboard' ? 'active-icon' : ''} />
                            </Link>
                            <Link href="/dashboard" _hover={{ textDecor: 'none' }} display={["flex", "flex", "none", "flex", "flex"]}>
                                <Text className={activePage === 'dashboard' ? 'active' : ''}>Home</Text>
                            </Link>
                        </Flex>
                        <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                            <Link href="/home" display={["none", "none", "flex", "flex", "flex"]}>
                                <Icon as={FiPieChart} fontSize="2xl" className={activePage === 'home' ? 'active-icon' : ''} />
                            </Link>
                            <Link href="/home" _hover={{ textDecor: 'none' }} display={["flex", "flex", "none", "flex", "flex"]}>
                                <Text className={activePage === 'home' ? 'active' : ''}>Predict</Text>
                            </Link>
                        </Flex>
                        <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                            <Link href="/crypto_info" display={["none", "none", "flex", "flex", "flex"]}>
                                <Icon as={FiDollarSign} fontSize="2xl" className={activePage === 'crypto_info' ? 'active-icon' : ''} />
                            </Link>
                            <Link href="/crypto_info" _hover={{ textDecor: 'none' }} display={["flex", "flex", "none", "flex", "flex"]}>
                                <Text className={activePage === 'crypto_info' ? 'active' : ''}>Currency Info</Text>
                            </Link>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
                    <Text textAlign="center">Team Predictors</Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Sidebar
