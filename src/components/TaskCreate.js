import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function TaskCreate({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [buttonText, setButtonText] = useState('Start Timer');
  const [buttonActive, setButtonActive] = useState(false);
  const submit = () => {
    if (title === '') return;
    onSubmit(title);
    setTitle('');
    setButtonText('Timer started...');
    setButtonActive(true);
    setTimeout(() => {
      setButtonText('Start timer');
      setButtonActive(false);
    }, 2000);
  };
  const handleKeyDown = e => e.which === 13 && submit();

  return (
    <div className="task-create">
      <input
        type="text"
        className="task-create-input"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className={`task-create-submit ${(title || buttonActive) && 'active'}`}
        onClick={submit}
      >
        {buttonText}
      </button>
    </div>
  );
}

TaskCreate.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
