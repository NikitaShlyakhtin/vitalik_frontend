import { makeAutoObservable } from "mobx";

class UserStore {
    private userID: string | null = sessionStorage.getItem("UserID");
    private token: string | null = sessionStorage.getItem("Token");

    wallets: Wallet[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    getUserID(): string {
        if (this.userID !== null) {
            return this.userID;
        }
        return sessionStorage.getItem("UserID") || "";
    }

    setUserID(id: string) {
        this.userID = id;
        sessionStorage.setItem("UserID", id);
    }

    setWallets(wallets: Wallet[]) {
        this.wallets = wallets;
    }

    getToken(): string {
        if (this.token !== null) {
            return this.token;
        }
        return sessionStorage.getItem("Token") || "";
    }

    setToken(token: string) {
        this.token = token;
        sessionStorage.setItem("Token", token);
    }
}

const userStore = new UserStore();

export default userStore;
