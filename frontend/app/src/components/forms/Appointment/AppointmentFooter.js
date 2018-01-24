import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'antd';

const AppointmentFooter = ({ buttons,
                             cancelHandler,
                             editHandler,
                             deleteHandler,
                             copyHandler }) => {
  const buttonCollection = {
    submit: (<button type="submit" key="submit" className="form__footer__button">Save</button>),
    cancel: (<button type="reset" key="cancel" onClick={cancelHandler} className="form__footer__button">Cancel</button>),
    edit: (<button type="reset" key="edit" onClick={editHandler} className="form__footer__button">Edit</button>),
    delete: (<button type="reset" key="delete" onClick={deleteHandler} className="form__footer__button">Delete</button>),
    copy: (<button type="reset" key="copy" onClick={copyHandler} className="form__footer__button">Copy</button>)
  };
  return (
    <Col span={24} data-id="appointmentFooter">
      {
        buttons.map(x => buttonCollection[x])
      }
    </Col>);
};

AppointmentFooter.propTypes = {
  buttons: PropTypes.array,
  cancelHandler: PropTypes.func,
  editHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
  copyHandler: PropTypes.func
};

export default AppointmentFooter;
