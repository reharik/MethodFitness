import { combineReducers } from 'redux';
import { tableReducers } from '../../src/index';

const testData = (state = [], action = null) => {
  if(action.type === 'getData'){
    return [...state, ...action.data]
  }
  return state;
}
  const reducers = combineReducers({
  testData,
  ...tableReducers
});
export default reducers;
