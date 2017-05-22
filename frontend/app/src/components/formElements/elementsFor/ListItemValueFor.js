import React from 'react';
import classNames from 'classnames';
import uuid from 'uuid';

const ListItemValueFor = (
  {
    data
  }
) => {

  let inputStyle = classNames(
    'editor__container__input', {
      editor__success: !data.invalid,
      editor__error: data.invalid
    });

  const required = data.rules.some(x => x.rule == 'required') ? '*' : '';
  return (
    <div className="editor_container">
      {
        data.value.map(i => {
          console.log('==========i=========');
          console.log(i);
          console.log('==========END i=========');
          
          return (
            <div className="list__item__value" key={i.item ? i.item.display : uuid.v4()}>
                <label className="editor__container__label" htmlFor={data.items.name}>
                  {i.item ? i.item.display : '' + required}
                </label>
              <input
                ref={node => data.items.ref = node}
                className={inputStyle}
                style={{"width":"30%"}}
                placeholder={data.placeholder}
                name={data.items.name}
                value={i.value}
                onChange={data.onChange}
              />
            </div>)
        })
      }
    </div>
  );
};

export default ListItemValueFor;
