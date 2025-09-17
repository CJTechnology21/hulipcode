import { configureStore } from '@reduxjs/toolkit';
import productReducer from './features/products/productSlice';
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice'
import pendingMaterialsReducer from './features/pendingMaterials/pendingMaterialsSlice';
export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    cart: cartReducer,
    PendingMaterials: pendingMaterialsReducer
  },
});

// // store.js
// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import { combineReducers } from "redux";
// import cartReducer from "./features/cart/cartSlice";

// const userId = localStorage.getItem("crm_user_id") || "guest"; // 👈 get current user ID

// // const persistConfig = {
// //   key: `cart_${userId}`, // 👈 cart saved as cart_userId
// //   storage,
// //   whitelist: ["cart"],
// // };

// // const rootReducer = combineReducers({
// //   cart: cartReducer,
// //   // Add other reducers if needed
// // });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export const persistor = persistStore(store);

// // src/app/store.js