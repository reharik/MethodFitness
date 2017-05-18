import React from 'react';
// import propToLabel from './../../utilities/propToLabel';
// import {actions as notifActions} from 'redux-notifications';
// const {notifSend, notifDismiss} = notifActions;
import Select from 'react-select';
// import uuid from 'uuid';

const _Input = ({data, containerStyle, dispatch}) => {
console.log('==========dataXXXXXX=========');
console.log(data);
console.log('==========END data=========');
  let validationState = data.isvalid ?  'input__success' : 'input__error';
  let style = 'input__container__' + (data.type ? data.type : 'input') + ' ' + validationState;
  let val = data.errors.length > 0 ? data.error : '';
  let valStyle = data.errors.length > 0
    ? 'input__container__validation__error'
    : 'input__container__validation__success';
  // let validationEl = null;
  // switch (validation) {
  //   case 'inline': {
  //     // if you use inline you'll need to adjust the height of the input container
  //     validationEl = (<div className={valStyle}>{val}</div>);
  //     break;
  //   }
  //   case 'top':
  //   default: {
  //     if (data.errors.length > 0) {
  //       dispatch(notifSend({
  //         id: data.name,
  //         message: data.error,
  //         kind: 'danger'
  //       }));
  //       // get state of notifications to determine if we should dispatch
  //     } else if (!data.error) {
  //       dispatch(notifDismiss(data.name));
  //     }
  //   }
  // }

  // const _containerStyle = containerStyle ? containerStyle : '';

  const input = function() {
    switch(data.type){
      case 'select': {
        return (<Select className={style} options={data.selectOptions} {...data} />)
      }
      case 'multi-select': {
        return (<Select className={style} options={data.selectOptions} {...data}  multi={true} />);
      }
      default:
      case 'input': {
        return (<input className={style}
                       type={data.type ? data.type : 'text'}
                       placeholder={data.placeholder}
                       name={data.name}
                       onChange={data.onChange}
           />)
      }
    }
  };

  return (<div className={"input__container "} >
    <label className="input__container__label" htmlFor={data.name}>{data.label}</label>
    {input()}
    {/*{validationEl}*/}
  </div>);
};

export default _Input;




