/**
 * Created by rharik on 5/3/16.
 */
if (process.env.NODE_ENV !== 'production') {
  module.exports = require('./configureStore.dev');
}
