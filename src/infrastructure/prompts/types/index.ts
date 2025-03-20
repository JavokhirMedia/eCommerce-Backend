export interface IResponseMap {
    [key: string]: {
        id: number;
        messages: {
            [key: string]: string;
        };
    };
}
