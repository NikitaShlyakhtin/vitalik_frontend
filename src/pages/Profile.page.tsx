import React, {useEffect, useState} from "react";
import {Badge, Container, Divider, Loader, Paper, Stack, Title, Text} from "@mantine/core";
import Navbar from "@/components/Navbar";
import userStore from "@/store/userStore";
import {formatDateStr} from "@/utils/date";
import {fetchTransactions} from "@/api/transactionsApi";

const ProfilePage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTransactions = async () => {
            if (userStore.getUserID() !== null) {
                try {
                    const transactions = await fetchTransactions([userStore.getUserID()]);
                    setTransactions(transactions);
                } catch (error) {
                    console.error("Error loading transactions:", error);
                    setError("Failed to load transactions");
                } finally {
                    setLoading(false);
                }
            }
        };

        loadTransactions();
    }, []);

    return (
        <Container size="xs" mt="xl">
            <Navbar/>
            <Title order={1} my="md" ta="center"><strong>{userStore.getUserID()}</strong></Title>
            <Title order={2} mb="lg" ta="center">Your Transactions</Title>
            {loading ? (
                <Loader size="xl" mt="md"/>
            ) : error ? (
                <Text c="red" ta="center">{error}</Text>
            ) : transactions.length === 0 ? (
                <Text ta="center" mt="md">No transactions found.</Text>
            ) : (
                <Stack gap="md">
                    {transactions.map(transaction => (
                        <Paper key={transaction.id} shadow="xs" p="md" withBorder>
                            <Text>
                                <strong>Amount:</strong> {transaction.amount === undefined ? 0 : transaction.amount} {transaction.currency}
                            </Text>
                            <Text>
                                <strong>From:</strong> {transaction.sender_requisites?.user_id || "Unknown"}
                            </Text>
                            <Text>
                                <strong>To:</strong> {transaction.receiver_requisites?.user_id || "Unknown"}
                            </Text>
                            {transaction.purpose && (
                                <Text>
                                    <strong>Purpose:</strong> {transaction.purpose}
                                </Text>
                            )}
                            <Divider my="sm"/>
                            <Badge color="gray">{formatDateStr(transaction.created_at || "")}</Badge>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Container>
    );
}

export default ProfilePage;