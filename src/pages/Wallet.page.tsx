import React, {useState, useEffect} from 'react';
import {Select, Button, Text, Container, Stack, Card, Title, Grid, Group, Box, NumberFormatter} from '@mantine/core';
import Navbar from "@/components/Navbar";
import userStore from "@/store/userStore";
import {createWallet, fetchWallets} from "@/api/walletsApi";
import {formatDateStr, formatShortDateStr} from "@/utils/date";
import {fetchAvailableCurrencies} from "@/api/currencyApi";
import {getCurrencyIconFromString} from "@/utils/currency";

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
            <Navbar/>
            <Stack mt="md">
                <Title order={1} ta="center">
                    Your Wallets
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
                    <Stack gap="xl" mt="xl">
                        {wallets.map((wallet) => {
                            const currencyIcon = getCurrencyIconFromString(wallet.currency)

                            return <Group key={wallet.requisites.address} justify="space-between">
                                <Group align="center">
                                    {currencyIcon}
                                    <Stack gap={0}>
                                        <Title order={4}>{wallet.currency}</Title>
                                        <Text size="sm" c="dimmed">
                                            Updated: {formatShortDateStr(wallet.updated_at || "")}
                                        </Text>
                                    </Stack>
                                </Group>
                                <Stack gap={0}>
                                    <Title order={5}>
                                        <NumberFormatter
                                            value={wallet.balance}
                                            suffix={` ${wallet.currency}`}
                                            thousandSeparator
                                        />
                                    </Title>
                                    <Text size="sm" c="dimmed">
                                        <NumberFormatter
                                            value={wallet.balance}
                                            prefix="$"
                                            thousandSeparator
                                        />
                                    </Text>
                                </Stack>
                            </Group>
                        })}
                    </Stack>
                )}
            </Stack>
        </Container>
    );
};

export default WalletPage;
