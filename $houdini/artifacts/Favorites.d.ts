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

export type Favorites$afterLoad = {
    readonly "data": {
        readonly "Favorites": Favorites$result
    }
};