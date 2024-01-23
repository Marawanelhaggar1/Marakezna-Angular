export interface Doctor {
    id: number;
    name: string;
    specialty: {
        id: string;
        specialty: string;
    };
    fee: string;
    address: string;
    title: string;
    rating: string;
    waiting: number;
    image: string;
    health_center: {
        id: string;
        name: string;
        phone: string;
        whatsApp: string;
    };
    phone: string;
    whatsApp: string;
    doctorSchedule: {
        id: number;
        date: string;
        start_time: string;
        end_time: string;
    }[];
}
