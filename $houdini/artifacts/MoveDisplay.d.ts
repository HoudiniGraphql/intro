enum Type {
    Grass = "Grass",
    Poison = "Poison",
    Fire = "Fire",
    Flying = "Flying",
    Water = "Water",
    Bug = "Bug",
    Normal = "Normal",
    Electric = "Electric",
    Ground = "Ground",
    Fairy = "Fairy",
    Fighting = "Fighting",
    Psychic = "Psychic",
    Rock = "Rock",
    Steel = "Steel",
    Ice = "Ice",
    Ghost = "Ghost",
    Dragon = "Dragon"
}

export type MoveDisplay = {
    readonly "shape"?: MoveDisplay$data,
    readonly "$fragments": {
        "MoveDisplay": true
    }
};

export type MoveDisplay$data = {
    readonly learned_at: number,
    readonly method: string,
    readonly move: {
        readonly name: string,
        readonly accuracy: number | null,
        readonly power: number | null,
        readonly pp: number,
        readonly type: Type | null
    }
};