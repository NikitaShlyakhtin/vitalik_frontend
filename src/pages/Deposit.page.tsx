import React, { useState } from 'react';
import { Button, Text, Container, Stack, Title, NumberInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import Navbar from '@/components/Navbar';
import WalletSelect from '@/components/WalletSelect';
import userStore from "@/store/userStore";
import {deposit} from "@/api/walletsApi";

const DepositPage: React.FC = observer(() => {
    const [selectedWalletAddress, setSelectedWalletAddress] = useState<string | null>(null);
    const [amount, setAmount] = useState<string | number>("");

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const wallets = userStore.wallets || [];

    const handleDeposit = async () => {
        if (!selectedWalletAddress || !amount) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const wallet = wallets.find(w => w.requisites.address === selectedWalletAddress);
            if (!wallet) {
                setError('Wallet not found.');
                setLoading(false);
                return;
            }

            const parsedAmount = parseFloat(amount.toString());
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                setError('Invalid amount. Must be a positive number.');
                setLoading(false);
                return;
            }

            await deposit(selectedWalletAddress, wallet.currency, parsedAmount);

            setSuccessMessage('Deposit successful!');
            setAmount("");
            setSelectedWalletAddress(null);
        } catch (error) {
            setError('Failed to make deposit. Please check your input and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="xs" mt="xl">
            <Navbar />
            <Stack mt="md">
                <Title order={1} ta="center">
                    Deposit
                </Title>

                <WalletSelect
                    label="Wallet"
                    placeholder="Select wallet"
                    selectedWallet={selectedWalletAddress}
                    onChange={setSelectedWalletAddress}
                />

                <NumberInput
                    label="Amount"
                    placeholder="Amount to deposit"
                    value={amount}
                    onChange={setAmount}
                    min={0}
                />

                <Button fullWidth onClick={handleDeposit} loading={loading}>
                    Make Deposit
                </Button>

                {error && <Text c="red" ta="center">{error}</Text>}
                {successMessage && <Text c="green" ta="center">{successMessage}</Text>}
            </Stack>
        </Container>
    );
});

export default DepositPage;
