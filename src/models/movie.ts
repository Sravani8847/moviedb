export interface Movie {
    title: string;
    release_date: string;
    vote_average: number;
    editors?: string[]; // Optional editors array
}

export interface MovieCredits {
    cast: any[];
    crew: {
        id: number;
        name: string;
        known_for_department: string;
        job: string;
    }[];
}
