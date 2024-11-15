interface Transaction {
    id?: string;

    sender_requisites?: Requisites;
    receiver_requisites?: Requisites;

    amount?: number;
    currency?: string;

    purpose?: string | null;

    created_at?: string;
    updated_at?: string;
}