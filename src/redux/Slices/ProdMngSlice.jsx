import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../utils/Api"


const LOCAL_STORAGE_KEY = 'prodMngData';

const getLocalProducts = () => {
  try {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const saveLocalProducts = (products) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getProdMngData = createAsyncThunk("getProdMngData", async () => {
  try {
    const res = Api.get("/products")
    return res;
  } catch (error) {
    return rejectWithValue(err.response)
  }
})

export const postProdMngForm = createAsyncThunk("postProdMngForm", async (submissionData) => {
  try {
    const res = await Api.post("/products", submissionData);
    return { ...res, localData: submissionData };
  } catch (err) {
    throw err;
  }
});


export const updateProduct = createAsyncThunk("updateProduct", async (productData) => {
  try {
    const res = await Api.put(`/products/${productData.id}`, productData);
    return { ...res, localData: productData };
  } catch (err) {
    throw err;
  }
});

export const deleteProduct = createAsyncThunk("deleteProduct", async (productId) => {
  try {
    const res = await Api.delete(`/products/${productId}`);
    return { ...res, productId };
  } catch (err) {
    throw err;
  }
});


const ProdMngSlice = createSlice({
  name: "prodMng",
  initialState: {
    prodMngLoading: false,
    prodMngData: [],
    postprodMngLoad: false,
    localProducts: [],
    localProducts: getLocalProducts()
  },

  reducers: {
    // Reducer to add product to local storage
    addLocalProduct: (state, action) => {
      state.localProducts.push(action.payload);
      state.prodMngData = [...state.prodMngData, action.payload];
      saveLocalProducts(state.localProducts); 
    },
    
    // Reducer to update product in local storage
    updateLocalProduct: (state, action) => {
      const index = state.localProducts.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.localProducts[index] = action.payload;
        saveLocalProducts(state.localProducts); 
        
        // Also update in prodMngData
        const prodIndex = state.prodMngData.findIndex(product => product.id === action.payload.id);
        if (prodIndex !== -1) {
          state.prodMngData[prodIndex] = action.payload;
        }
      }
    },
    
    // Reducer to delete product from local storage
    deleteLocalProduct: (state, action) => {
      state.localProducts = state.localProducts.filter(product => product.id !== action.payload);
      saveLocalProducts(state.localProducts); 
      state.prodMngData = state.prodMngData.filter(product => product.id !== action.payload);
    },
    
    // Reducer to load data from localStorage
    loadFromLocalStorage: (state) => {
      state.localProducts = getLocalProducts();
      if (state.prodMngData.length > 0) {
        // Remove any local products that might have been deleted from API
        const apiIds = state.prodMngData.map(p => p.id);
        state.localProducts = state.localProducts.filter(p => !apiIds.includes(p.id));
        state.prodMngData = [...state.prodMngData, ...state.localProducts];
      } else {
        state.prodMngData = [...state.localProducts];
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProdMngData.pending, (state) => {
        state.prodMngLoading = true;
      })
      .addCase(getProdMngData.fulfilled, (state, action) => {
        state.prodMngLoading = false;
        const apiProducts = action.payload.data;
        
        // Filter out any local products that might have the same ID as API products
        const filteredLocalProducts = state.localProducts.filter(
          localProduct => !apiProducts.some(apiProduct => apiProduct.id === localProduct.id)
        );
        
        state.prodMngData = [...apiProducts, ...filteredLocalProducts];
      })
      .addCase(getProdMngData.rejected, (state, action) => {
        state.prodMngLoading = false;
        console.log("getProdMngData request rejected", action.error);
        // If API fails, use only local data
        state.prodMngData = [...state.localProducts];
      })
      .addCase(postProdMngForm.pending, (state) => {
        state.postprodMngLoad = true;
      })
      .addCase(postProdMngForm.fulfilled, (state, action) => {
        state.postprodMngLoad = false;
        // Add the product to local storage since API doesn't persist
        const newProduct = action.payload.localData;
        state.localProducts.push(newProduct);
        saveLocalProducts(state.localProducts); // Save to localStorage
        state.prodMngData = [...state.prodMngData, newProduct];
      })
      .addCase(postProdMngForm.rejected, (state, action) => {
        state.postprodMngLoad = false;
        console.log("postProdMngForm request rejected", action.error);
      })
      .addCase(updateProduct.pending, (state) => {
        state.postprodMngLoad = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.postprodMngLoad = false;
        // Update the product in local storage
        const updatedProduct = action.payload.localData;
        
        const index = state.localProducts.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
          state.localProducts[index] = updatedProduct;
          saveLocalProducts(state.localProducts); 
        }
        
        // Also update in prodMngData
        const prodIndex = state.prodMngData.findIndex(product => product.id === updatedProduct.id);
        if (prodIndex !== -1) {
          state.prodMngData[prodIndex] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.postprodMngLoad = false;
        console.log("updateProduct request rejected", action.error);
      })
      .addCase(deleteProduct.pending, (state) => {
        state.postprodMngLoad = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.postprodMngLoad = false;
        // Remove the product from local storage
        const productId = action.payload.productId;
        state.localProducts = state.localProducts.filter(product => product.id !== productId);
        saveLocalProducts(state.localProducts); 
        state.prodMngData = state.prodMngData.filter(product => product.id !== productId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.postprodMngLoad = false;
        console.log("deleteProduct request rejected", action.error);
      });
  }
})

export const { addLocalProduct, updateLocalProduct, deleteLocalProduct, loadFromLocalStorage } = ProdMngSlice.actions;
export default ProdMngSlice.reducer;