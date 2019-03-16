const constructId = (obj, id) => {
  if (!Array.isArray(id)) {
    return obj[id];
  }
  return `${obj[id[0]]}-${obj[id[1]]}`;
};

const singleReducer = (map = new Map(), item = {}, id) => {
  // map set will add or update if existing
  let _id = constructId(item, id);
  map.set(_id, item);
  return map;
};

export default (currentItems = [], newItems = [], id = 'id') => {
  if (!newItems || newItems.length <= 0 || typeof newItems === 'object' && Object.keys(newItems).length === 0) {
    return currentItems;
  }
  // if you are passing a single make it an array
  if(!Array.isArray(newItems) && newItems) {
    newItems = [newItems];
  };

  if (currentItems.length <= 0) {
    return newItems;
  }

  // create a new map by using the obj id for key and obj for value
  let m = new Map();
  for (let obj of currentItems) {
    let _id = constructId(obj, id);
    if (_id) {
      m.set(_id, obj);
    }
  }

  // iterate over new items adding them to the map or updating existing item
  newItems.reduce((prev, item) => singleReducer(prev, item, id), m);
  // return an array of the values.  so array in array out

  return [...m.values()];
};
