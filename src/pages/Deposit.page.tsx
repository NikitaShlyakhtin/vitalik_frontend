import React, {useState} from 'react';
import {Button, Text, Container, Stack, Title, NumberInput, rem} from '@mantine/core';
import {observer} from 'mobx-react-lite';
import Navbar from '@/components/Navbar';
import WalletSelect from '@/components/WalletSelect';
import userStore from "@/store/userStore";
import {deposit} from "@/api/walletsApi";

const DepositPage: React.FC = observer(() => {
    const [selectedWalletAddress, setSelectedWalletAddress] = useState<string | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

    const [amount, setAmount] = useState<string | number>("");

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const wallets = userStore.wallets || [];

    const handleWalletSelection = async (value: string | null) => {
        try {
            const wallet = wallets.find(w => w.requisites.address === value);
            if (!wallet) {
                setError('Wallet not found.');
                setLoading(false);
                return;
            }
            setSelectedWalletAddress(value);
            setSelectedWallet(wallet);
        } catch (error) {
            setError('Failed to make deposit. Please check your input and try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleDeposit = async () => {
        if (!selectedWallet || !amount) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const parsedAmount = parseFloat(amount.toString());
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                setError('Invalid amount. Must be a positive number.');
                setLoading(false);
                return;
            }

            await deposit(selectedWallet.requisites.address, selectedWallet.currency, parsedAmount);

            setSuccessMessage('Deposit successful!');
            setAmount("");
            setSelectedWalletAddress(null)
            setSelectedWallet(null)
        } catch (error) {
            setError('Failed to make deposit. Please check your input and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="xs" mt="xl">
            <Navbar/>
            <Stack mt="md">
                <Title order={1} ta="center">
                    Deposit
                </Title>

                <WalletSelect
                    label="Wallet"
                    placeholder="Select wallet"
                    selectedWallet={selectedWalletAddress}
                    onChange={handleWalletSelection}
                />

                <NumberInput
                    label="Amount"
                    placeholder="Amount to deposit"
                    value={amount}
                    onChange={setAmount}
                    min={0}
                    suffix={` ${selectedWallet?.currency}`}
                    thousandSeparator
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
