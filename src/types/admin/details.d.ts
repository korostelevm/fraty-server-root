interface IDetailsUpdate {
    name: string;
    description: string;
    image: string;
    status: boolean;
}

interface IUsers {
    email: string;
    role: string;
    name: string;
}

interface IUsersUpdate {
    email: string;
    role: string;
}


export {
    IDetailsUpdate,
    IUsers,
    IUsersUpdate
}