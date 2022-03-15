export type SpriteInfo = {
    readonly "shape"?: SpriteInfo$data,
    readonly "$fragments": {
        "SpriteInfo": true
    }
};

export type SpriteInfo$data = {
    readonly name: string,
    readonly sprites: {
        readonly front: string
    }
};