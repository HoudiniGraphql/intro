export type SpeciesInfo = {
    readonly "input": SpeciesInfo$input,
    readonly "result": SpeciesInfo$result | undefined
};

export type SpeciesInfo$result = {
    readonly species: {
        readonly name: string,
        readonly flavor_text: string,
        readonly favorite: boolean,
        readonly evolution_chain: ({
            readonly $fragments: {
                SpeciesPreview: true
            }
        })[],
        readonly $fragments: {
            SpriteInfo: true
        }
    } | null
};

export type SpeciesInfo$input = {
    id: number
};