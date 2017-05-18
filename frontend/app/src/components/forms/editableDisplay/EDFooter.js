import React from 'react';

const EDFooter = ({ editing, toggleEdit }) => {
  return (
    <div className="editableDisplay__footer">
      {editing
        ? <div>
          <button type="submit" className="editableDisplay__footer__button"> Submit</button>
          <button onClick={e => toggleEdit(e, true)}>Cancel</button>
        </div>
        : <a className="editableDisplay__footer_edit" onClick={e => toggleEdit(e, false)}>edit</a>}
    </div>
  );
};

export default EDFooter;
