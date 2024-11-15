import React, { useState, useEffect } from 'react';
import { Select, Button, Text, Container, Stack, Card, Title, Grid } from '@mantine/core';
import Navbar from "@/components/Navbar";
import userStore from "@/store/userStore";
import {createWallet, fetchWallets} from "@/api/walletsApi";
import { formatDateStr } from "@/utils/date";
import {fetchAvailableCurrencies} from "@/api/currencyApi";

const WalletPage: React.FC = () => {
    const [currency, setCurrency] = useState('');
    const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch available currencies on component mount
    useEffect(() => {
        const listAvailableCurrencies = async () => {
            try {
                const currencies = await fetchAvailableCurrencies();
                setAvailableCurrencies(currencies);
            } catch (error) {
                setError('Failed to load available currencies');
            }
        };

        listAvailableCurrencies();
    }, []);

    useEffect(() => {
        const loadWallets = async () => {
            if (!userStore.getUserID()) {
                setError('UserID is not available');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const walletsData: Wallet[] = await fetchWallets(userStore.getUserID());
                setWallets(walletsData);
                userStore.setWallets(walletsData);
            } catch (error) {
                setError('Failed to load wallets');
            } finally {
                setLoading(false);
            }
        };

        loadWallets();
    }, []);

    const handleCreateWallet = async () => {
        if (!userStore.getUserID()) {
            setError('Invalid user ID');
            return;
        } else if (!currency) {
            setError('Please select a currency');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await createWallet(userStore.getUserID(), currency);

            const updatedWallets = await fetchWallets(userStore.getUserID());
            setWallets(updatedWallets);
            setCurrency('');
            userStore.setWallets(updatedWallets);
        } catch (error) {
            setError('Failed to create wallet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="xs" mt="xl">
            <Navbar />
            <Stack mt="md">
                <Title order={1} ta="center">
                    Wallet
                </Title>
                <Select
                    label="Currency"
                    placeholder="Select currency"
                    data={availableCurrencies} // Use available currencies as options
                    value={currency}
                    onChange={(value) => setCurrency(value || '')} // Handle selection
                />
                <Button fullWidth onClick={handleCreateWallet} loading={loading}>
                    Create Wallet
                </Button>

                {error && <Text c="red" ta="center">{error}</Text>}

                {!error && (
                    <Grid mt="xl">
                        {wallets.map((wallet) => (
                            <Grid.Col span={12} key={wallet.requisites.address}>
                                <Card shadow="sm" p="lg" withBorder>
                                    <Text size="md"><strong>Currency:</strong> {wallet.currency}</Text>
                                    <Text size="md"><strong>Balance:</strong> {wallet.balance}</Text>
                                    <Text size="md"><strong>Created at:</strong> {formatDateStr(wallet.created_at)}</Text>
                                    <Text size="md"><strong>Updated at:</strong> {formatDateStr(wallet.updated_at)}</Text>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                )}
            </Stack>
        </Container>
    );
};

export default WalletPage;
