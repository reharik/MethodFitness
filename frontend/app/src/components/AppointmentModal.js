import React from 'react';
import PropTypes from 'prop-types';
import MFModal from './../components/mfModal/MFModal';
import AppointmentContainer from './../containers/forms/AppointmentContainer';

const AppointmentModal = ({
  args,
  onClose,
  onCopy,
  onEdit,
  isCopy,
  isEdit,
  isOpen,
  title,
}) => {
  const titleBar = {
    className: 'heading',
    text: title,
    enable: true,
  };
  return (
    <MFModal titleBar={titleBar} isOpen={isOpen} closeModal={onClose}>
      <AppointmentContainer
        args={args}
        onCancel={onClose}
        onCopy={onCopy}
        onEdit={onEdit}
        isCopy={isCopy}
        isEdit={isEdit}
      />
    </MFModal>
  );
};

AppointmentModal.propTypes = {
  form: PropTypes.object,
  args: PropTypes.object,
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  onEdit: PropTypes.func,
  isCopy: PropTypes.bool,
  isEdit: PropTypes.bool,
  isOpen: PropTypes.bool,
  title: PropTypes.string,
};

export default AppointmentModal;
