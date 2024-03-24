import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'; // Updated import statement
import { thunk } from 'redux-thunk'; // Corrected import statement
import logger from 'redux-logger'; // Corrected import statement
import rootReducer from './reducers/index';

const initialState = {};
const middleware = [thunk, logger];

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Updated middleware setup
    preloadedState: initialState,
});

export default store;
