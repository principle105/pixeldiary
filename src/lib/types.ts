import type { ObjectId } from "mongodb";

export type Cell = string | null;

export interface Pixel {
    id: string;
    created: Date;
    emotion: string;
    cells: Cell[];
    public: boolean;
    description: any;
}

export interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    image: string;
    drawings: Pixel[];
    streak: number;
    lastDrawn: Date | null;
}

export interface DatabaseUser extends User {
    _id: ObjectId;
}
