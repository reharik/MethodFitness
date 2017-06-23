import React from 'react';
import { Input, InputNumber, DatePicker, Select } from 'antd';
import ListItemValueFor from './ListItemValueFor';
import InputColor from 'react-input-color';
const Option = Select.Option;


const InputFor = ({ data, selectOptions, onChange }) => {
  const input = function() {
    switch (data['x-input'] || data.type) {
      case 'date-time': {
        const _onChange = onChange ? {onChange} : {};
        return (
          <DatePicker style={{width: '100%'}} {..._onChange} />
        );
      }
      case 'color-picker': {
        data.value = data.value || '#345678';
        return <InputColor {...data} />;
      }
      case 'select': {
        const _onChange = onChange ? {onChange} : {};
        let _data = {...data, value: undefined};
        return (
          <Select filterOption="true" {..._data} {..._onChange}>
            { selectOptions.map(x => (<Option key={x.value} value={x.value} >{x.display}</Option>)) }
          </Select>
        );
      }
      case 'multi-select': {
        const _onChange = onChange ? {onChange} : {};
        let _data = {...data, value: undefined};
        return (
          <Select mode="multiple" filterOption="true" {..._data} {..._onChange}>
            { selectOptions.map(x => (<Option key={x.value} value={x.value} >{x.display}</Option>)) }
          </Select>
        );
      }

      case 'textArea': {
        const _onChange = onChange ? {onChange} : {};
        return (
          <Input
            type="textarea"
            placeholder={data.placeholder}
            name={data.name}
            {..._onChange}
          />
        );
      }
      case 'listItemValue': {
        return (
          <ListItemValueFor data={data} />
        );
      }
      case 'number': {
        const _onChange = onChange ? {onChange} : {};
        return (
          <InputNumber
            {..._onChange}
            placeholder={data.placeholder}
            min={0}
            name={data.name}
          />
        );
      }

      default:
      case 'password':
      case 'string': {
        const password = data['x-input'] === 'password' ? { type: 'password' } : '';
        const _onChange = onChange ? {onChange} : {};
        return (
          <Input
            {...password}
            {..._onChange}
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
