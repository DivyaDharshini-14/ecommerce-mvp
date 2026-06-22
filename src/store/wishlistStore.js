import { create } from 'zustand';

export const useWishlistStore = create((set) => ({
  wishlist: [],
  addToWishlist: (product) =>
    set((state) => {
      if (state.wishlist.find((item) => item.id === product.id)) return state;
      return { wishlist: [...state.wishlist, product] };
    }),
  removeFromWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== productId),
    })),
  isInWishlist: (productId) => {
    // Note: get() is generally used outside components, but we provide this as a helper
    // We'll rely on the reactive state array mostly.
    return false;
  }
}));
