import React, { useEffect, useState } from 'react';
import { Container, Title, Stack, Text, Loader, Paper, Flex, Box, Divider } from '@mantine/core';
import Navbar from "@/components/Navbar";
import { formatDateStr } from "@/utils/date";
import {fetchOrders} from "@/api/ordersApi";

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
        <Container size="md" mt="xl">
            <Navbar />
            <Title order={1} my="md" ta="center">Order Book - BTC/USDT</Title>
            {loading ? (
                <Loader size="xl" mt="md" />
            ) : error ? (
                <Text c="red" ta="center">{error}</Text>
            ) : (
                <Flex mt="md">
                    <Box flex={1} p="xl">
                        <Title order={2} ta="center">Sell Orders</Title>
                        <Divider mt="lg" />
                        <Stack mt="lg">
                            {sellOrders.map(order => (
                                <Paper key={order.id} shadow="xs" p="md" withBorder>
                                    <Text>
                                        <strong>UserID:</strong> {order.sell_requisites.user_id}
                                    </Text>
                                    <Text>
                                        <strong>Price:</strong> {order.price} {order.buy_currency}
                                    </Text>
                                    <Text>
                                        <strong>Quantity:</strong> {order.sell_quantity} {order.sell_currency}
                                    </Text>
                                    <Text>
                                        <strong>Created at:</strong> {formatDateStr(order.created_at)}
                                    </Text>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                    <Divider orientation="vertical" />
                    <Box flex={1} p="xl">
                        <Title order={2} ta="center">Buy Orders</Title>
                        <Divider mt="lg" />
                        <Stack mt="lg">
                            {buyOrders.map(order => (
                                <Paper key={order.id} shadow="xs" p="md" withBorder>
                                    <Text>
                                        <strong>UserID:</strong> {order.buy_requisites.user_id}
                                    </Text>
                                    <Text>
                                        <strong>Price:</strong> {order.price} {order.sell_currency}
                                    </Text>
                                    <Text>
                                        <strong>Quantity:</strong> {order.buy_quantity} {order.buy_currency}
                                    </Text>
                                    <Text>
                                        <strong>Created at:</strong> {formatDateStr(order.created_at)}
                                    </Text>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                </Flex>
            )}
        </Container>
    );
};

export default OrderBookPage;
