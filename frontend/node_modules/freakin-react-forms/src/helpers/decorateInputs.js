import React from 'react';
import selectn from 'selectn';

const decorateInput = (children, model) => {
  return React.Children.map(children, x => {
    // if you have ternary logic that returns null x will be null
    if (!x || !x.props) { return x; }
    const property = model[selectn('frfProperty.name', x.props)];
    if (property) {
      if (typeof property !== 'object') {
        throw new Error(`No property on model with name: ${x.frfProperty}!`);
      }
        // so if your Inputs are redux containers, they will not rerender if the top level properties
        // of "modelProperty" have not changed, since we are changing the deeper values, we need a
        // couple hacks here (dataVal and rerenderHack) to trigger a rerender if those props have changed
      return React.cloneElement(x, {
        data: property,
        dataVal: property.value,
        rerenderHack: property.errors.length > 0 ? property.errors : undefined
      });
    }
    let clonedItems = decorateInput(x.props.children, model);
    return React.cloneElement(x, {children: clonedItems});
  });
};

export default decorateInput;
