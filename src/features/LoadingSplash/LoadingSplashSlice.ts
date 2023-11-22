import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type LoadingSplashStateType = {
    value: boolean
}

const initialState: LoadingSplashStateType = {
    value: false
}

const loadingSplashSlice = createSlice({
    name: 'loadingSplash',
    initialState,
    reducers: {
        toggleSplash: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload
        }
    }
})

const loadingSplashReducer = loadingSplashSlice.reducer
export const { toggleSplash } = loadingSplashSlice.actions
export const selectSplash = (state: LoadingSplashStateType) => state.value

export default loadingSplashReducer
