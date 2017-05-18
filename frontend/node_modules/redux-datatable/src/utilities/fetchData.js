import 'isomorphic-fetch';
import { DATA_REQUEST, DATA_FAILURE, DATA_SUCCESS } from '../modules/dataRowModule'

var config;

const handleUrl = function(dispatch) {
  fetch(config.dataSource)
    .then(response =>
      response.json().then(json => ({json, response}))
    ).then(({json, response}) => {
    if (!response.ok) {
      dispatch({
        type: DATA_FAILURE,
        error: error.message || 'wtf'

      });
      return Promise.reject(json)
    }
    dispatch({
      type: DATA_SUCCESS,
      data: response.data
    })
  })
};

const handlePromise = function(dispatch) {
  config.dataSource()
    .then(response => {
      if (!response || !response.ok) {
        dispatch({
          type: DATA_FAILURE,
          error: response.error || response.message || 'wtf'
        });
      return;
      }
      dispatch({
        type: DATA_SUCCESS,
        data: response.data
      })
    })
};

const handleDispatch = function(dispatch) {
  dispatch(config.dispatchDataSource());
};

function fetchData(dispatch, _config) {
  config = _config;
  dispatch({
    type: DATA_REQUEST
  });
  if (typeof config.dataSource === 'function') {
    handlePromise(dispatch);
  } else if (typeof config.dataSource === 'string') {
    handleUrl(dispatch);
  } else if (typeof config.dispatchDataSource === 'function'){
    handleDispatch(dispatch);
  }
}

export default fetchData;
