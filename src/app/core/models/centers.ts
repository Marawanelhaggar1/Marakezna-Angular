export interface Centers {
    id: number;
    name: string;
    address: string;
    area: {
        id: number;
        name: string;
    };
    service: {
        id: number;
        name: string;
    }[];
    image: string;
    logo: string;
    description: string;
    description2: string;
    whatsApp: string;
    phone: string;
}
