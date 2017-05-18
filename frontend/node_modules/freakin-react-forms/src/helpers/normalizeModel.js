import uuid from 'uuid';

export function propToLabel(val) {
  return val ? val.replace(/([A-Z])/g, ' $1')
  // uppercase the first character
    .replace(/^./, str => str.toUpperCase())
    : val;
}

const normalizeModel = (props, events) => {
  let formName = props.formName || uuid.v4();
  const model = props.model;
  const modelArray = model && Object.keys(model).map((x, i) => {
    //validate required props
    const item = model[x];
    let value = item.value || '';
    if (item.type === 'array' && value === '') {
      value = [];
    }

    let clone = Object.assign({}, item);
    clone.label = propToLabel(item.label || item.name);
    clone.placeholder = propToLabel(item.placeholder) || propToLabel(item.label || item.name);
    clone.rules = item.rules || [];
    clone.value = value;
    clone.onChange = events.onChangeHandler;
    clone.onBlur = events.onBlurHandler;
    clone.errors = [];
    clone.invalid = false;
    clone.formName = formName;
    clone.key = formName + '_' + i;
    return clone;
  });
  return modelArray.reduce((prev, next) => {
    prev[next.name] = next;
    return prev;
  }, {});

};

export default normalizeModel;
