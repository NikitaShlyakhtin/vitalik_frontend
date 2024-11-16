import axios from "axios";
import userStore from "../store/userStore";

export async function fetchWallets(userId: string): Promise<Wallet[]> {
    const url = "https://container-app-d87wt-pocket.containers.cloud.ru/auth/wallets";
    const token = userStore.getToken();

    try {
        console.log("fetch", token)
        const response = await axios.post(
            url,
            {
                addresss_in: [],
                user_ids_in: [userId],
            },
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to fetch wallets");
        }

        const wallets: Wallet[] = await response.data;
        return wallets;
    } catch (error) {
        console.error("Error fetching wallets:", error);
        throw error;
    }
}

export async function createWallet(userID: string, currency: string): Promise<Wallet> {
    const url = "https://container-app-d87wt-pocket.containers.cloud.ru/auth/wallets/create";
    const token = userStore.getToken();

    try {
        const response = await axios.post(
            url,
            {
                user_id: userID,
                currency,
            },
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to create wallet");
        }

        return await response.data;
    } catch (error) {
        console.error("Error creating wallet:", error);
        throw error;
    }
}

export async function deposit(address: string, currency: string, amount: number): Promise<void> {
    const url = "https://container-app-d87wt-pocket.containers.cloud.ru/auth/wallets/deposit";
    const token = userStore.getToken();

    try {
        const response = await axios.put(
            url,
            {
                address,
                currency,
                amount,
            },
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to deposit funds");
        }
    } catch (error) {
        console.error("Error making deposit:", error);
        throw error;
    }
}
