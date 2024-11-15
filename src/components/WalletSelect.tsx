import React, { useEffect, useState, useMemo } from 'react';
import { Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import userStore from '@/store/userStore';
import { fetchWallets } from "@/api/walletsApi";

interface WalletSelectProps {
    label: string;
    placeholder: string;
    selectedWallet: string | null;
    onChange: (value: string | null) => void;
    excludeWallets?: string[];
    excludeCurrencies?: string[];
}

const WalletSelect: React.FC<WalletSelectProps> = observer(({
                                                                label,
                                                                placeholder,
                                                                selectedWallet,
                                                                onChange,
                                                                excludeWallets = [],
                                                                excludeCurrencies = [],
                                                            }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!userStore.getUserID()) {return;}
            setLoading(true);
            try {
                const wallets = await fetchWallets(userStore.getUserID());
                userStore.setWallets(wallets);
            } catch (error) {
                console.error('Failed to fetch wallets', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredWallets = useMemo(() => {
        return userStore.wallets.filter((wallet) => {
            const isExcludedWallet = excludeWallets.includes(wallet.requisites.address);
            const isExcludedCurrency = excludeCurrencies.includes(wallet.currency);
            return !isExcludedWallet && !isExcludedCurrency;
        });
    }, [userStore.wallets, excludeWallets, excludeCurrencies]);

    const walletOptions = useMemo(() => {
        return filteredWallets
            .map((wallet) => ({
                value: wallet.requisites.address,
                label: `${wallet.balance} ${wallet.currency}`,
            }));
    }, [filteredWallets]);

    return (
        <Select
            label={label}
            placeholder={loading ? 'Loading wallets...' : placeholder}
            value={selectedWallet}
            onChange={onChange}
            data={walletOptions}
            disabled={loading || walletOptions.length === 0}
        />
    );
});

export default WalletSelect;
