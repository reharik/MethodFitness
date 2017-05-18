import { eqBy, prop, sortBy } from 'ramda';

//TODO put in sort

export default function(items, metaData) {
  metaData.selectedItems && metaData.selectedItems.forEach( x => {
    var item = items.find( y => y.id == x);
    if(item){
      item.selected = true;
    }
  });
  return items;
}
