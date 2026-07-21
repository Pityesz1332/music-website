// We may need this in the future
export type User = {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
};

export const usersData: User[] = [];