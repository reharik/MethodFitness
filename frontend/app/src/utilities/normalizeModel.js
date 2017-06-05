import uuid from 'uuid';
import formJsonSchema from './formJsonSchema';
import moment from 'moment';
export function propToLabel(val) {
  return val ? val.replace(/([A-Z])/g, ' $1')
  // uppercase the first character
    .replace(/^./, str => str.toUpperCase())
    : val;
}

const normalizeModel = (schema, obj, formName) => {
  moment.locale('en');
  const model = formJsonSchema(schema, obj);
  formName = formName || uuid.v4();
  const modelArray = model && Object.keys(model).map((x, i) => {
    //validate required props
    const item = {...model[x]};
    let value = item.value || '';
    if (item.type === 'array' && value === '') {
      value = [];
    }
    if(item['x-input'] === 'date-time' && value) {
      value = moment(value);
    }

    item.label = propToLabel(item.label || item.name);
    item.placeholder = propToLabel(item.placeholder) || propToLabel(item.label || item.name);
    item.rules = item.rules || [];
    item.value = value;
    item.formName = formName;
    item.key = formName + '_' + i;
    return item;
  });

  return modelArray && modelArray.reduce((prev, next) => {
    prev[next.name] = next;
    return prev;
  }, {});
};

export default normalizeModel;
