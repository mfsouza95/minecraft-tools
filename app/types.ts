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

export interface HistoryEntry{
  selectedItem: string;
  quantity: number;
  tree: ResultObject;
  rawMaterials: ResultRaw;
}