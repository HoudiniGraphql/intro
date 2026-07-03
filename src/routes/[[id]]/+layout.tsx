import { isPending } from "$houdini";
import { FavoritePreview, FavoritesContainer, Shimmer } from "~/components";
import type { LayoutProps } from "./$types";

export default function Layout({ children, Favorites }: LayoutProps) {
  const loading = isPending(Favorites.favorites);
  const favorites = loading ? [] : (Favorites.favorites ?? []);

  return (
    <>
      <FavoritesContainer>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex h-full shrink-0 items-center p-[8px]">
              <Shimmer width="70px" height="70px" radius="8px" />
            </div>
          ))
        ) : favorites.length > 0 ? (
          favorites.map((fav, i) => (
            <FavoritePreview
              key={isPending(fav.id) ? i : fav.id}
              species={fav}
            />
          ))
        ) : (
          <p>No Favorites Selected</p>
        )}
      </FavoritesContainer>
      {children}
    </>
  );
}
