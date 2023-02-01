interface IAddLevel {
    name: string;
    description: string;
    image: string;
    points: number;
    level: number;
}

interface IUpdateLevel {
    id: string;
    name: string;
    description: string;
    image: string;
    points: number;
    level: number;
}

interface IDeleteLevel {
    id: string | any;
}

interface IGetLevel {
    id: string | any;
}


export { IAddLevel, IUpdateLevel, IDeleteLevel, IGetLevel };