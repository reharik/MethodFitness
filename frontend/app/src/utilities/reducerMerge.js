const singleReducer = (map = new Map(), item = {}, id = 'id') => {
  // map set will add or update if existing
  map.set(item[id], item);
  return map;
};

export default (currentItems = [], newItems, id) => {
  if (!newItems || newItems.length <= 0) {
    return currentItems;
  }

  // if you are passing a single make it an array
  newItems = Array.isArray(newItems) ? newItems : [newItems];

  if (currentItems.length <= 0) {
    return newItems;
  }

  // create a new map by using the obj id for key and obj for value
  let m = new Map();
  for(let obj of currentItems) {
    if (obj && obj[id]) {
      m.set(obj[id], obj);
    }
  }

  // iterate over new items adding them to the map or updating existing item
  newItems.reduce((prev, item) => singleReducer(prev, item, id), m);
  // return an array of the values.  so array in array out
  return [...m.values()];
};
