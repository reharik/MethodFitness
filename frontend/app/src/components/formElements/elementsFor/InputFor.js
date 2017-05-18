import React from 'react';
import InputColor from 'react-input-color';
import TokenAutocomplete from '../reactSelect/index';
import Datepicker from 'react-datepicker';
import moment from 'moment';
import classNames from 'classnames'

const InputFor = ({data,
                selectOptions, onChange}) => {

  let inputStyle = classNames({
    ['editor__container__' + (data.type ? data.type : 'input')]: true,
    'editor__success': !data.invalid,
    'editor__error': data.invalid
  });

  const input = function () {
    switch (data['x-input'] || data.type) {
      case 'date-time': {
        const defaultOnChange = mom => data.onChange({target: {name: data.name, value: mom.toISOString()}});
        const _onChange = onChange || defaultOnChange;
        data.value = data.value ? data.value : moment().toISOString();
        return (<Datepicker selected={moment(data.value)}
                            {...data}
                            onChange={_onChange}
                            onBlur={data.onBlur}
                            className={inputStyle}/>)
      }
      case 'color-picker':
      {
        const defaultOnChange = color => data.onChange({target: {name: data.name, value: color}});
        const _onChange = onChange || defaultOnChange;
        data.value = data.value || "#345678";
        return (<InputColor {...data} defaultValue={data.value} onChange={_onChange}/>)
      }
      case 'select':
      {
        const _onChange = onChange || data.onChange;
        const selected = selectOptions.find(x=>x.value === data.value);
        return (<TokenAutocomplete className={inputStyle} simulateSelect={true}
                                   parseToken={ value => value.display || value }
                                   parseOption={ value => value.display || value }
                                   options={selectOptions} {...data}
                                   defaultValues={selected || []}
                                   filterOptions={true}
                                   {...data}
                                   onChange={_onChange} />)
      }
      case 'multi-select':
      {
        const _onChange = onChange || data.onChange;
        const selected = data.value ? data.value.map(x=> selectOptions.find(y=> y.value === x)) : [];

        return (<TokenAutocomplete className={inputStyle}
                                   defaultValues={selected}
                                   limitToOptions={true}
                                   parseToken={ value => value.display }
                                   parseOption={ value => value.display }
                                   options={selectOptions}
                                   {...data}
                                   onChange={_onChange}/>);
      }

      case 'textArea': {
        const _onChange = onChange || data.onChange;

        return (<textarea className={inputStyle}
                       placeholder={data.placeholder}
                       name={data.name}
                       value={data.value}
                       onChange={_onChange} />)
      }
      default:
      case 'number':
      case 'password':
      case 'string':
      {
        const _onChange = onChange || data.onChange;
        const password = data['x-input'] === 'password' ? {type: "password"} : '';
        return (<input ref={node => data.ref = node} className={inputStyle}
                      {...password}
                       placeholder={data.placeholder}
                       name={data.name}
                       value={data.value}
                       onChange={_onChange} />)
      }
    }
  };

  return (
    <div className="editor_input" >
      { input() }
    </div>)
};

export default InputFor;
