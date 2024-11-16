import React, {useState} from 'react';
import {Container, Stack, Select, NumberInput, Button, Title, Text} from '@mantine/core';
import Navbar from "@/components/Navbar";
import WalletSelect from "@/components/WalletSelect";
import userStore from "@/store/userStore";
import {createOrder} from "@/api/ordersApi";
import {meta} from "eslint-plugin-react/lib/rules/jsx-props-no-spread-multi";
import description = meta.docs.description;

type OrderType = 'BUY' | 'SELL';

const NewOrderPage: React.FC = () => {
    const [orderType, setOrderType] = useState<OrderType>('BUY');

    const [sellWallet, setSellWallet] = useState<string | null>(null);
    const [sellQuantity, setSellQuantity] = useState<string | number | undefined>();

    const [price, setPrice] = useState<number>(0);

    const [buyWallet, setBuyWallet] = useState<string | null>(null);
    const [buyQuantity, setBuyQuantity] = useState<string | number | undefined>();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const wallets = userStore.wallets || [];

    const getWalletByAddress = (address: string | null) => wallets.find(w => w.requisites.address === address);

    const sellWalletCurrency = sellWallet ? getWalletByAddress(sellWallet)?.currency : '';
    const buyWalletCurrency = buyWallet ? getWalletByAddress(buyWallet)?.currency : '';

    const isValidWalletSelection = sellWallet && buyWallet && sellWallet !== buyWallet && sellWalletCurrency !== buyWalletCurrency;

    const handleSubmit = async () => {
        if (!isValidWalletSelection) {
            setError('You must select two different wallets with different currencies.');
            return;
        }

        if (price <= 0) {
            setError('Price must be greater than 0');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        const requestPayload = {
            type: orderType,
            sell_currency: sellWalletCurrency,
            sell_quantity: orderType === 'SELL' ? sellQuantity : null,
            sell_requisites: {
                user_id: userStore.getUserID(),
                address: sellWallet,
            },
            price,
            buy_currency: buyWalletCurrency,
            buy_quantity: orderType === 'BUY' ? buyQuantity : null,
            buy_requisites: {
                user_id: userStore.getUserID(),
                address: buyWallet,
            },
        };

        try {
            await createOrder(requestPayload);
            setSuccess('Order created successfully!');
        } catch (err) {
            console.log(err);
            setError('Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const description = !buyWalletCurrency || !sellWalletCurrency
        ? ""
        : orderType === 'BUY'
            ? `Buying price for 1 ${buyWalletCurrency} to ${sellWalletCurrency}`
            : `Selling price for 1 ${sellWalletCurrency} to ${buyWalletCurrency}`;

    const suffix = !buyWalletCurrency || !sellWalletCurrency
        ? ""
        : orderType === 'BUY'
            ? sellWalletCurrency
            : buyWalletCurrency;

    return (
        <Container size="xs" mt="xl">
            <Navbar/>
            <Stack mt="md">
                <Title order={1} ta="center">New Order</Title>

                <Select
                    label="Order Type"
                    value={orderType}
                    onChange={(value) => setOrderType(value as OrderType)}
                    data={[
                        {value: 'BUY', label: 'Buy'},
                        {value: 'SELL', label: 'Sell'},
                    ]}
                />

                {orderType === 'SELL' ? (
                    <>
                        <WalletSelect
                            label="Sell Wallet"
                            placeholder="Sell Wallet"
                            selectedWallet={sellWallet}
                            onChange={setSellWallet}
                            excludeWallets={buyWallet ? [buyWallet] : []}
                            excludeCurrencies={buyWalletCurrency ? [buyWalletCurrency] : []}
                        />

                        <NumberInput
                            label="Sell Quantity"
                            value={sellQuantity}
                            onChange={setSellQuantity}
                            placeholder="e.g., 1.5"
                            min={0}
                            suffix={` ${sellWalletCurrency}`}
                            thousandSeparator
                        />

                        <WalletSelect
                            label="Buy Wallet"
                            placeholder="Buy Wallet"
                            selectedWallet={buyWallet}
                            onChange={setBuyWallet}
                            excludeWallets={sellWallet ? [sellWallet] : []}
                            excludeCurrencies={sellWalletCurrency ? [sellWalletCurrency] : []}
                        />
                    </>
                ) : (
                    <>
                        <WalletSelect
                            label="Buy Wallet"
                            placeholder="Buy Wallet"
                            selectedWallet={buyWallet}
                            onChange={setBuyWallet}
                            excludeWallets={sellWallet ? [sellWallet] : []}
                            excludeCurrencies={sellWalletCurrency ? [sellWalletCurrency] : []}
                        />

                        <NumberInput
                            label="Buy Quantity"
                            value={buyQuantity}
                            onChange={setBuyQuantity}
                            placeholder="e.g., 1.5"
                            min={0}
                            suffix={` ${buyWalletCurrency}`}
                            thousandSeparator
                        />

                        <WalletSelect
                            label="Sell Wallet"
                            placeholder="Sell Wallet"
                            selectedWallet={sellWallet}
                            onChange={setSellWallet}
                            excludeWallets={buyWallet ? [buyWallet] : []}
                            excludeCurrencies={buyWalletCurrency ? [buyWalletCurrency] : []}
                        />
                    </>
                )}

                <NumberInput
                    label="Price"
                    description={description}
                    placeholder="e.g., 100"
                    value={price}
                    onChange={(value) => setPrice(Number(value))}
                    min={0}
                    suffix={` ${suffix}`}
                    thousandSeparator
                />

                <Button onClick={handleSubmit} loading={loading} fullWidth>
                    Submit Order
                </Button>

                {error && <Text c="red" ta="center">{error}</Text>}
                {success && <Text c="green" ta="center">{success}</Text>}
            </Stack>
        </Container>
    );
};

export default NewOrderPage;
