export interface ResultObject {
    name?: string;
    quantity?: number;
    ingredients?: ResultObject[];
};

interface RawMaterial {
    quantity: number;
    stacks: number;
    remainder: number;
}

export interface ResultRaw{
    [key: string]: RawMaterial;
}