import { configureStore } from "@reduxjs/toolkit";
import ProdMngReducer from "../Slices/ProdMngSlice"

export const store = configureStore({
    reducer: {
        prodMng: ProdMngReducer,
    }
})