import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber, DatePicker, Select, Checkbox } from 'antd';
import ListItemValueFor from './ListItemValueFor';
import InputColor from 'rc-color-picker';
const Option = Select.Option;

const InputFor = ({ data, selectOptions, onChange, form, extraFunc }) => {
  const { value, ..._data } = data; //eslint-disable-line no-unused-vars
  const input = function input() {
    switch (_data['x-input'] || _data.type) {
      case 'date-time': {
        const _onChange = onChange ? { onChange } : {};
        // used so you can't set appointments in past
        const disabledDate = extraFunc ? { disabledDate: extraFunc } : {};
        return (
          <DatePicker
            id={data.name}
            style={{ width: '100%' }}
            {...disabledDate}
            {..._onChange}
            format={'MM/DD/YYYY'}
          />
        );
      }
      case 'color-picker': {
        const colorValue =
          typeof form.getFieldValue(_data.name) === 'object'
            ? form.getFieldValue(_data.name).color
            : form.getFieldValue(_data.name);
        return <InputColor color={colorValue} />;
      }
      case 'select': {
        const _onChange = onChange ? { onChange } : {};
        const filter = (v, o) =>
          o.props.children.toLowerCase().includes(v.toLowerCase());
        return (
          <Select
            filterOption={filter}
            showSearch
            placeholder={_data.placeholder}
            {..._onChange}
          >
            {selectOptions.map(x => (
              <Option key={x.value} value={x.value} data-id={data.name}>
                {x.display}
              </Option>
            ))}
          </Select>
        );
      }
      case 'multi-select': {
        const _onChange = onChange ? { onChange } : {};
        const filter = (v, o) =>
          o.props.children.toLowerCase().includes(v.toLowerCase());
        return (
          <Select
            mode="multiple"
            filterOption={filter}
            placeholder={_data.placeholder}
            {..._onChange}
          >
            {selectOptions.map(x => (
              <Option key={x.value} value={x.value} data-id={data.name}>
                {x.display}
              </Option>
            ))}
          </Select>
        );
      }

      case 'textArea': {
        const _onChange = onChange ? { onChange } : {};
        return (
          <Input.TextArea
            placeholder={_data.placeholder}
            name={_data.name}
            {..._onChange}
          />
        );
      }
      case 'listItemValue': {
        return <ListItemValueFor data={_data} form={form} />;
      }
      case 'number': {
        const _onChange = onChange ? { onChange } : {};
        return (
          <InputNumber
            {..._onChange}
            placeholder={_data.placeholder}
            min={0}
            name={_data.name}
          />
        );
      }
      case 'boolean': {
        const _onChange = onChange ? { onChange } : {};
        return (
          <Checkbox
            {..._onChange}
            placeholder={_data.placeholder}
            name={_data.name}
          >
            {_data.label}
          </Checkbox>
        );
      }

      default:
      case 'password':
      case 'string': {
        const password =
          _data['x-input'] === 'password' ? { type: 'password' } : '';
        const _onChange = onChange ? { onChange } : {};
        return (
          <Input
            {...password}
            {..._onChange}
            placeholder={_data.placeholder}
            name={_data.name}
          />
        );
      }
    }
  };

  return input();
};

InputFor.propTypes = {
  data: PropTypes.object,
  selectOptions: PropTypes.array,
  onChange: PropTypes.func,
  form: PropTypes.object,
  extraFunc: PropTypes.func,
};

export default InputFor;
