import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

const EDFooter = ({ editing, toggleEdit }) => {
  return (
    <Row type="flex" >
      {editing
        ? <Col span={10} offset={14} >
          <button type="submit" className="form__footer__button" > Submit</button>
          <button onClick={e => toggleEdit(e, true)} className="form__footer__button">Cancel</button>
        </Col>
        : <Col span={5} offset={19} >
          <button onClick={e => toggleEdit(e, false)} className="form__footer__button">Edit</button>
        </Col>}
    </Row>
  );
};

EDFooter.propTypes = {
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func
};

export default EDFooter;
