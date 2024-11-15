import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DepositPage from "@/pages/Deposit.page";
import WalletPage from "@/pages/Wallet.page";
import UserIDPrompt from "@/components/UserIDPrompt";
import userStore from "@/store/userStore";
import OrderBookPage from "@/pages/OrderBook.page";
import ProfilePage from "@/pages/Profile.page";
import NewOrderPage from "@/pages/NewOrder.page";

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProfilePage />,
    },
    {
        path: '/deposit',
        element: <DepositPage />,
    },
    {
        path: '/order',
        element: <NewOrderPage />,
    },
    {
        path: '/orders',
        element: <OrderBookPage />,
    },
    {
        path: '/wallets',
        element: <WalletPage />,
    },
]);

export function Router() {
    const [isUserIDSet, setIsUserIDSet] = useState(false);

    // Check if the userID is already in the global store
    useEffect(() => {
        if (userStore.getUserID()) {
            setIsUserIDSet(true);
        }
    }, []);

    // Callback to set the userID flag once collected
    const handleUserIDCollected = () => {
        setIsUserIDSet(true);
    };

    // Show the UserIDPrompt until userID is collected
    if (!isUserIDSet) {
        return <UserIDPrompt onUserIDCollected={handleUserIDCollected} />;
    }

    // Once userID is collected, render the Router
    return <RouterProvider router={router} />;
}