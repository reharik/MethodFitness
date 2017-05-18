import React, {PropTypes} from 'react';
import MFModal from './../components/mfModal/MFModal';

const AppointmentModal = ({form, onClose, isOpen, title}) => {

  const titleBar = {
    className: 'heading',
    text: title,
    enable: true
  };
  return (
    <MFModal titleBar={titleBar} isOpen={isOpen} closeModal={onClose}>
      {form}
    </MFModal>
  );
};

AppointmentModal.propTypes = {
  form: PropTypes.object,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  title: PropTypes.string
};

export default AppointmentModal;
