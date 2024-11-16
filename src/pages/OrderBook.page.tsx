import React, { useEffect, useState } from 'react';
import {Container, Title, Text, Loader, Flex, Box, Divider, Stack, Group, NumberFormatter} from '@mantine/core';
import Navbar from "@/components/Navbar";
import { fetchOrders } from "@/api/ordersApi";

const OrderBookPage: React.FC = () => {
    const [buyOrders, setBuyOrders] = useState<Order[]>([]);
    const [sellOrders, setSellOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const orders = await fetchOrders();

                setBuyOrders(orders.filter(order => order.type === 'BUY' && order.status === 'ORDER_OPEN'));
                setSellOrders(orders.filter(order => order.type === 'SELL' && order.status === 'ORDER_OPEN'));

            } catch (error) {
                console.error("Error loading orders:", error);
                setError("Failed to load order book");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return (
        <Container size="xs" mt="xl">
            <Navbar />
            <Title order={1} my="md" ta="center">BTC/USDT</Title>
            {loading ? (
                <Loader size="xl" mt="md" />
            ) : error ? (
                <Text c="red" ta="center">{error}</Text>
            ) : (
                <Stack mt="md">
                    <Group justify="space-between">
                        <Title order={4} c="dimmed" ta="center">Price</Title>
                        <Title order={4} c="dimmed" ta="center">Amount</Title>
                    </Group>

                    {/* Sell Orders */}
                    <Box>
                        <Stack justify="space-between">
                            {sellOrders.map(order => (
                                <Flex key={order.id} justify="space-between">
                                    <Title c="red" order={5}>
                                        <NumberFormatter
                                            value={order.price}
                                            suffix={` ${order.buy_currency}`}
                                            thousandSeparator
                                        />
                                    </Title>
                                    <Title order={5}>
                                        <NumberFormatter
                                            value={order.sell_quantity}
                                            suffix={` ${order.sell_currency}`}
                                            thousandSeparator
                                        />
                                    </Title>
                                </Flex>
                            ))}
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Buy Orders */}
                    <Box>
                        <Stack >
                            {buyOrders.map(order => (
                                <Flex key={order.id} justify="space-between">
                                    <Title c="green" order={5}>
                                        <NumberFormatter
                                            value={order.price}
                                            suffix={` ${order.sell_currency}`}
                                            thousandSeparator
                                        />
                                    </Title>
                                    <Title order={5}>
                                        <NumberFormatter
                                            value={order.buy_quantity}
                                            suffix={` ${order.buy_currency}`}
                                            thousandSeparator
                                        />
                                    </Title>
                                </Flex>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            )}
        </Container>
    );
};

export default OrderBookPage;
