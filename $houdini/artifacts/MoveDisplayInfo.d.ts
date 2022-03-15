export type MoveDisplayInfo = {
    readonly "shape"?: MoveDisplayInfo$data,
    readonly "$fragments": {
        "MoveDisplayInfo": true
    }
};

export type MoveDisplayInfo$data = {
    readonly learned_at: number,
    readonly move: {
        readonly name: string
    }
};