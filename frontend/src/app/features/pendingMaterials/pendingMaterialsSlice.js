// src/features/pendingMaterials/pendingMaterialsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedMaterials: [],
};

const pendingMaterialsSlice = createSlice({
  name: 'pendingMaterials',
  initialState,
  reducers: {
    setSelectedMaterials: (state, action) => {
      state.selectedMaterials = action.payload;
    },
    clearSelectedMaterials: (state) => {
      state.selectedMaterials = [];
    },
    updateMaterialStatus: (state, action) => {
      const { itemIndex, currentStatus, newStatus } = action.payload;
      // Flatten all materials
      const materials = [...state.selectedMaterials];
      const itemToMove = {
        ...materials[itemIndex],
        status: newStatus,
      };
      materials[itemIndex] = itemToMove;
      state.selectedMaterials = materials;
    },
  },
});

export const {
  setSelectedMaterials,
  clearSelectedMaterials,
  updateMaterialStatus,
} = pendingMaterialsSlice.actions;

export default pendingMaterialsSlice.reducer;
