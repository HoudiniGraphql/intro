export type FavoritePreview = {
    readonly "shape"?: FavoritePreview$data,
    readonly "$fragments": {
        "FavoritePreview": true
    }
};

export type FavoritePreview$data = {
    readonly id: number,
    readonly name: string,
    readonly sprites: {
        readonly front: string
    }
};