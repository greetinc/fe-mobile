import { createStore } from 'redux';
import rootReducer from './screens/reducers';

const store = createStore(rootReducer);

export default store;