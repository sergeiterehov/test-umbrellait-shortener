export interface IBadParam {
    param: string;
    value: any;
    msg: string;
    location?: string;
}

export class ErrorData extends Error {
    public errors: IBadParam[];

    constructor(errors: IBadParam[]) {
        super("Invalid data");

        this.errors = errors;
    }
}
