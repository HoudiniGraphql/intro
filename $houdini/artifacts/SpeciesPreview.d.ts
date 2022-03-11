export type SpeciesPreview = {
    readonly "shape"?: SpeciesPreview$data,
    readonly "$fragments": {
        "SpeciesPreview": true
    }
};

export type SpeciesPreview$data = {
    readonly name: string,
    readonly id: number,
    readonly $fragments: {
        SpriteInfo: true
    }
};