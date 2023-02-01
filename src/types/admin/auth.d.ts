interface AdminCreate {
    email: string;
    password: string;
    name: string;
    role: string;
}

interface AdminUpdate {
    email: string;
    password: string;
    name: string;
    role: string;
}

interface Login {
    email: string;
    password: string;
}

export { AdminCreate, AdminUpdate, Login };