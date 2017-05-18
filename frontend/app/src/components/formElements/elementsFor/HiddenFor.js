import React from 'react';

const Hidden = ({data}) => {

  return (<input name={data.name}
               value={data.value}
               type="hidden"/>);
};

export default Hidden;