import {merge} from 'lodash';
import uuid from 'uuid';

let config = {
  dataSource: undefined,
  bulkSelection: {
    mode:'none',
    identityColumn: 'id'
  },
  actionDataProp: 'payload'
  //bunch of default values here;
};

export function updateConfigs(newConfig) {

  //TODO validate configs as we define them
  merge(config, newConfig);
  return config;
}

export { config };

// schema for bulkSelection
//  mode = multiple | single | disabled | none -> default multiple
// identityColumn -> default 'id' it is required to have either an id or some other identifying column
