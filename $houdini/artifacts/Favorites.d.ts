export type Favorites = {
    readonly "input": null,
    readonly "result": Favorites$result | undefined
};

export type Favorites$result = {
    readonly favorites: ({
        readonly $fragments: {
            FavoritePreview: true
        }
    })[]
};