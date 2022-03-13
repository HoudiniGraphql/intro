export type ToggleFavorite = {
    readonly "input": ToggleFavorite$input,
    readonly "result": ToggleFavorite$result | undefined
};

export type ToggleFavorite$result = {
    readonly toggleFavorite: {
        readonly species: {
            readonly favorite: boolean,
            readonly $fragments: {
                FavoriteSpecies_toggle: true
            }
        } | null
    } | null
};

export type ToggleFavorite$input = {
    id: number
};