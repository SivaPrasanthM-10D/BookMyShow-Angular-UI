export interface Show {
    showId: string;
    movieTitle: string;
    theatreName: string;
    screenNumber: number;
    showTime: string;  // ISO format or readable time
    availableSeats: number;
}
