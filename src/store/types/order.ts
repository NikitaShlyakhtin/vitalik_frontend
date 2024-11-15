interface Order {
    id: string;

    type: 'BUY' | 'SELL';

    sell_currency: string;
    sell_quantity: number;
    sell_requisites: Requisites;

    price: number;

    buy_currency: string;
    buy_quantity: number;
    buy_requisites: Requisites;

    status: string;

    created_at: string;
}