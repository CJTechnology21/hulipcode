// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './features/products/productSlice';
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';
import pendingMaterialsReducer from './features/pendingMaterials/pendingMaterialsSlice';

// redux-persist imports
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// 👇 Only persist pendingMaterials slice
const pendingMaterialsPersistConfig = {
  key: 'pendingMaterials',
  storage,
  whitelist: ['selectedMaterials'], // only persist this field
};

const persistedPendingMaterialsReducer = persistReducer(
  pendingMaterialsPersistConfig,
  pendingMaterialsReducer
);

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    cart: cartReducer,
    pendingMaterials: persistedPendingMaterialsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// import { configureStore } from '@reduxjs/toolkit';
// import productReducer from './features/products/productSlice';
// import authReducer from './features/auth/authSlice';
// import cartReducer from './features/cart/cartSlice'
// import pendingMaterialsReducer from './features/pendingMaterials/pendingMaterialsSlice';
// export const store = configureStore({
//   reducer: {
//     products: productReducer,
//     auth: authReducer,
//     cart: cartReducer,
//     pendingMaterials: pendingMaterialsReducer
//   },
// });
