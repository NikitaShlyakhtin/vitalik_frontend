import {IconCoin, IconCoinBitcoin, IconCurrencyEthereum} from "@tabler/icons-react";

export function getCurrencyIconFromString(currency: string) {
    if (currency === "USDT") {
        return (<IconCoin size={50} color="#40c057"/>)
    } else if (currency === "BTC") {
        return (<IconCoinBitcoin size={50} color="#1c7ed6"/>)
    } else if (currency === "ETH") {
        return (<IconCurrencyEthereum size={50} color="#1c7ed6"/>)
    }
}