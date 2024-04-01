import { configureStore } from '@reduxjs/toolkit'; // Chỉ cần import configureStore
import logger from 'redux-logger'; // Import logger để sử dụng như một middleware tùy chọn
import rootReducer from './reducers/index'; // Giả sử bạn có các reducer tổng hợp ở đây

const initialState = {}; // initialState có thể không cần thiết nếu bạn không muốn đặt trước trạng thái

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV !== 'production'
        ? getDefaultMiddleware().concat(logger)
        : getDefaultMiddleware(),
    preloadedState: initialState, // chỉ cần thêm nếu bạn thực sự cần trạng thái khởi tạo ban đầu
});

export default store;