interface Wallet {
    requisites: Requisites;
    currency: string;
    balance: number;
    created_at: string;
    updated_at: string;
}

interface Requisites {
    user_id: string;
    address: string;
}