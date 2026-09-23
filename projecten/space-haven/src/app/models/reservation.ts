export interface Reservation {
    id?: number;
    shipId: number;
    dockId: number;
    startTime: string;
    endTime: string;
}
