import axios from "axios";

const baseURL = "https://container-app-d87wt-pocket.containers.cloud.ru";

export async function register(userId: string, password: string): Promise<void> {
    const url = `${baseURL}/register`;

    try {
        const response = await axios.post(url, {
            user_id: userId,
            password,
        });

        if (response.status === 409) {
            throw new Error("User already exists");
        }

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to register");
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Register error:", error);
            throw new Error(error.response?.data.message);
        }
        console.error("Register error:", error);
        throw error;
    }
}

export async function login(userId: string, password: string): Promise<string> {
    const url = `${baseURL}/login`;

    try {
        const response = await axios.post(url, {
            user_id: userId,
            password,
        });

        const data = await response.data;

        return data.token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Login error:", error);
            throw new Error(error.response?.data.message);
        }
        console.error("Login error:", error);
        throw error;
    }

    return "";
}
