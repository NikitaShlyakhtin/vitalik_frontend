import { useState } from "react";
import { Modal, Button, TextInput, PasswordInput, Flex, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";
import userStore from "../store/userStore";
import { fetchWallets } from "@/api/walletsApi";
import { login, register } from "@/api/authApi";

interface UserIDPromptProps {
    onUserIDCollected: () => void;
}

const UserIDPrompt: React.FC<UserIDPromptProps> = observer(({ onUserIDCollected }) => {
    const [userIDInput, setUserIDInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleSubmit = async () => {
        if (!userIDInput.trim() || !passwordInput.trim()) {
            return;
        }

        const userID = userIDInput.trim();
        const password = passwordInput.trim();

        setLoading(true);
        setErrorMessage(""); // Reset error message before making a request

        try {
            if (isRegistering) {
                await register(userID, password);
            }

            const token = await login(userID, password);
            userStore.setUserID(userID);
            userStore.setToken(token);

            onUserIDCollected();

            const wallets = await fetchWallets(userID);
            userStore.setWallets(wallets);
        } catch (error) {
            console.error("Authentication or fetching wallets failed", error);
            if (error instanceof Error) {
                // Set error message based on error type
                setErrorMessage(error.message || "Something went wrong.");
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    // If userID is already set, don't show the modal
    if (userStore.getUserID()) {
        return null;
    }

    return (
        <Modal
            opened={!userStore.getUserID()}
            onClose={() => {}}
            withCloseButton={false}
            overlayProps={{
                color: "#d3d3d3",
                backgroundOpacity: 1,
                blur: 10,
            }}
            centered
            title={isRegistering ? "Register" : "Login"}
        >
            <TextInput
                label="Enter your UserID"
                placeholder="UserID"
                value={userIDInput}
                onChange={(event) => setUserIDInput(event.currentTarget.value)}
            />
            <PasswordInput
                label="Password"
                placeholder="Password"
                mt="md"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.currentTarget.value)}
            />

            {errorMessage && (
                <Text color="red" mt="md">
                    {errorMessage}
                </Text>
            )}

            <Flex mt="lg" align="center" justify="space-between">
                <Button variant="subtle" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Already have an account?" : "Don't have an account?"}
                </Button>
                <Button onClick={handleSubmit} loading={loading}>
                    {isRegistering ? "Register" : "Login"}
                </Button>
            </Flex>
        </Modal>
    );
});

export default UserIDPrompt;
