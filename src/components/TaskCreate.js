import React, { useState } from 'react';
import PropTypes from 'prop-types';

const placeholders = [
  'Layout my personal portfolio',
  'Coffe break',
  'Learn about this new framework',
  'Read new articles on Hacker News',
  'Structure the new platform achitecture',
  'Design a new logo for my customer',
  'Refactor code of my TodoMVC',
  'Tell my friends about Timmi',
  'Schedule meeting about new project idea',
];
const randomPlaceholder =
  placeholders[Math.floor(Math.random() * placeholders.length)];

export default function TaskCreate({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [buttonText, setButtonText] = useState('Start Timer');
  const [buttonActive, setButtonActive] = useState(false);
  const [buttonClass, setButtonClass] = useState('');
  const submit = () => {
    if (title === '') {
      setButtonClass('error');
      setTimeout(() => setButtonClass(''), 500);
      return;
    }
    onSubmit(title);
    setTitle('');
    setButtonText('Timer started!');
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
        placeholder={randomPlaceholder}
      />
      <button
        type="button"
        className={`task-create-submit ${
          title !== '' || buttonActive ? 'active' : ''
        } ${buttonClass}`}
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
