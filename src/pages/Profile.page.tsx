import React, {useEffect, useState} from "react";
import {Badge, Container, Loader, Paper, Stack, Text, Group, Title, NumberFormatter} from "@mantine/core";
import Navbar from "@/components/Navbar";
import userStore from "@/store/userStore";
import {formatShortDateStr} from "@/utils/date";
import {fetchTransactions} from "@/api/transactionsApi";
import {IconArrowDownRight, IconArrowUpRight, IconInfoCircle} from "@tabler/icons-react";

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
            <Title order={1} my="md" ta="center">
                <strong>{userStore.getUserID()}</strong>
            </Title>
            <Title order={2} mb="lg" ta="center">
                Last Transactions
            </Title>
            {loading ? (
                <Loader size="xl" mt="md"/>
            ) : error ? (
                <Text c="red" ta="center">{error}</Text>
            ) : transactions.length === 0 ? (
                <Text ta="center" mt="md">No transactions found.</Text>
            ) : (
                <Stack gap="xl">
                    {transactions.map(transaction => {
                        let transactionIcon;
                        let transactionAmount;
                        if (transaction.sender_requisites?.user_id === userStore.getUserID()) {
                            transactionIcon = <IconArrowUpRight size={40} color="#fa5252"/>
                            transactionAmount =
                                <Text fw={500}>
                                    - <NumberFormatter
                                    value={transaction.amount}
                                    suffix={` ${transaction?.currency}`}
                                    thousandSeparator
                                />
                                </Text>
                        } else if (transaction.sender_requisites?.user_id !== "" || (transaction.amount && transaction.amount > 0)) {
                            transactionIcon = <IconArrowDownRight size={40} color="#40c057"/>
                            transactionAmount =
                                <Text fw={500}>
                                    + <NumberFormatter
                                    value={transaction.amount}
                                    suffix={` ${transaction?.currency}`}
                                    thousandSeparator
                                />
                                </Text>
                        } else {
                            transactionIcon = <IconInfoCircle size={40} color="#1c7ed6"/>
                            transactionAmount = <Text fw={500}>{transaction.currency}</Text>
                        }

                        return <Stack key={transaction.id}>
                            <Text size="sm" c="dimmed">
                                {formatShortDateStr(transaction.created_at || "")}
                            </Text>
                            <Paper key={transaction.id} radius="md">
                                <Group justify="space-between">
                                    <Group>
                                        {transactionIcon}
                                        <Stack gap="xs">
                                            <Text fw={500}>{transaction.purpose}</Text>
                                            <Badge color="green" variant="light">
                                                Confirmed
                                            </Badge>
                                        </Stack>
                                    </Group>
                                    <Group justify="apart">
                                        {transactionAmount}
                                    </Group>
                                </Group>
                            </Paper>
                        </Stack>
                    })}
                </Stack>
            )}
        </Container>
    );
}

export default ProfilePage;