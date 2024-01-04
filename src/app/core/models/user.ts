export interface User {
    user: {
        id: number;
        name: string;
        email: string;
        password: string;
    };
    token: string;
    role: string;
}
