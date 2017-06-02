import React from 'react';
import { Input, DatePicker, Select } from 'antd';
const Option = Select.Option;

const InputFor = ({ data, selectOptions }) => {
  const input = function() {
    switch (data['x-input'] || data.type) {
      case 'date-time': {
        return (
          <DatePicker />
        );
      }
      // case 'color-picker': {
      //   const defaultOnChange = color => data.onChange({target: {name: data.name, value: color}});
      //   const _onChange = onChange || defaultOnChange;
      //   data.value = data.value || '#345678';
      //   return <InputColor {...data} defaultValue={data.value} onChange={_onChange}/>;
      // }
      case 'select': {
        return (
          <Select filterOption="true" {...data}>
            { selectOptions.map(x => (<Option key={x.key} value={x.value} >{x.value}</Option>)) }
          </Select>
        );
      }
      case 'multi-select': {
        return (
          <Select mode="multiple" filterOption="true" {...data}>
            { selectOptions.map(x => (<Option key={x.key} value={x.value} >{x.value}</Option>)) }
          </Select>
        );
      }

      case 'textArea': {
        return (
          <Input
            type="textarea"
            placeholder={data.placeholder}
            name={data.name}
          />
        );
      }
      // case 'listItemValue': {
      //   return (
      //     <ListItemValueFor
      //       className={inputStyle}
      //       data={data}
      //     />
      //   );
      // }
      default:
      case 'number':
      case 'password':
      case 'string': {
        const password = data['x-input'] === 'password' ? { type: 'password' } : '';
        return (
          <Input
            {...password}
            placeholder={data.placeholder}
            name={data.name}
          />
        );
      }
    }
  };

  return input();
};

export default InputFor;
