export type MoveDisplay = {
    readonly "shape"?: MoveDisplay$data,
    readonly "$fragments": {
        "MoveDisplay": true
    }
};

export type MoveDisplay$data = {
    readonly learned_at: number,
    readonly move: {
        readonly name: string
    }
};