const flat = (r, a) => {
  if (!Array.isArray(a)) {
    if (!r.some(x => a.name === x.name)) {
      r.push(a);
    }
    return r;
  }
  return a.reduce(flat, r);
};

const mapProperty = (parent, propertyName) => ({
  ...parent.properties[propertyName],
  name: propertyName,
  parent: parent.title,
  rules: []
});

// here parent is so you can get the required off of it
const mapRules = (parent, property) => {
  if (parent.required && parent.required.some(x => x === property.name)) {
    property.rules.push({ rule: 'required' });
  }
  // propbably put the rule in an x-val or x-rule unless the data faker has
  // some convention for it
  // schemaRules.foreach(r => r(property));
  return property;
};

export default function(schema, obj) {
  if (!schema) {
    return;
  }
  const recurseProps = (parent, nestObj) => {
    return Object.keys(parent.properties).map(p => {
      if (parent.properties[p].type !== 'object' && !parent.properties[p].properties) {
        let val = mapRules(parent, mapProperty(parent, p));
        if (nestObj) {
          val.value = nestObj[p];
        }
        return val;
      } else if (parent.properties[p].title === 'entity') {
        let val = mapRules(parent, mapProperty(parent, p));
        if (nestObj) {
          val.value = nestObj[p];
        }
        return val;
      }
      return recurseProps(parent.properties[p], nestObj ? nestObj[p] : undefined);
    });
  };
  return recurseProps(schema, obj).reduce(flat, []).reduce((prev, next) => {
    prev[next.name] = next;
    return prev;
  }, {});
}

/*
  format:
    date-time,
    email,
    hostname,
    ipv4,
    ipv6,
    url,
    uuid*
  numbers:
    multipleOf,
    maximum(exclusiveMaximum),
    minimum(exclusiveMinimum)
  string:
    maxLength,
    minLength,
    pattern,
  array:
    maxItems,
    minItems,
    uniqueItems,


 */

