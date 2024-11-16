import axios from "axios";
import userStore from "../store/userStore";

export async function fetchTransactions(userIdIn?: string[], addressIn?: string[]): Promise<Transaction[]> {
    const url = "https://container-app-d87wt-pocket.containers.cloud.ru/auth/transactions";
    const token = userStore.getToken();

    try {
        const payload: any = {};
        if (userIdIn !== undefined) {
            payload.user_id_in = userIdIn;
        }
        if (addressIn !== undefined) {
            payload.address_in = addressIn;
        }

        const response = await axios.post(
            url,
            payload,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to fetch transactions");
        }

        return await response.data as Transaction[];
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}
