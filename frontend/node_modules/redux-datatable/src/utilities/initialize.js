import {updateConfigs } from './configValues';
import { bulkSelectionColumn } from '../components/CheckBox';
import { column } from './../modules/tableModule';

export default function({configured,
  setColumns,
  setConfig,
  config,
  columns}) {

  if (configured) { return; }

  var _config = updateConfigs(config);
  _config.configured = true;
  setConfig(_config);

  //TODO exptract into strategy or command pattern later
  if (_config.bulkSelection.mode !== 'none') {
    columns.unshift(bulkSelectionColumn(_config));
  }

  //TODO prolly do something like create default columns from data name here
  if (columns) {
    var map = columns.map(column);
    setColumns(map)
  }
}
