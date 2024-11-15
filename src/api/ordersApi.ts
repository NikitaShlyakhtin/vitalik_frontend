import axios from "axios";
import userStore from "../store/userStore";

export async function createOrder(orderPayload: any): Promise<void> {
    const url = "http://localhost:8080/auth/orders/create";
    const token = userStore.getToken();

    try {
        const response = await axios.post(
            url,
            orderPayload,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to create order");
        }
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

export async function fetchOrders(): Promise<Order[]> {
    const url = "http://localhost:8080/auth/orders";
    const token = userStore.getToken();

    try {
        const response = await axios.post(
            url,
            {
                currency_pair: {
                    currency1: 'BTC',
                    currency2: 'USDT',
                },
            },
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to fetch orders");
        }

        return response.data as Order[];
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}
