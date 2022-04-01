export type TrackSpeciesFavorite = {
    readonly "input": null,
    readonly "result": TrackSpeciesFavorite$result | undefined
};

export type TrackSpeciesFavorite$result = {
    readonly speciesFavoriteToggled: {
        readonly species: {
            readonly favorite: boolean,
            readonly $fragments: {
                FavoriteSpecies_toggle: true
            }
        }
    }
};

export type TrackSpeciesFavorite$afterLoad = {
    readonly "data": {
        readonly "TrackSpeciesFavorite": TrackSpeciesFavorite$result
    }
};