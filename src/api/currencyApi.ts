import axios from "axios";
import userStore from "../store/userStore";

export async function fetchAvailableCurrencies(): Promise<string[]> {
    const url = "http://localhost:8080/auth/currencies";
    const token = userStore.getToken();

    try {
        const response = await axios.get(
            url,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to fetch available currencies");
        }

        return await response.data as string[];
    } catch (error) {
        console.error("Error fetching currencies:", error);
        throw error;
    }
}
