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
  const submit = () => {
    if (title === '') return;
    onSubmit(title);
    setTitle('');
    setButtonText('Timer started...');
    setTimeout(() => {
      setButtonText('Start timer');
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
      <button type="button" className="task-create-submit" onClick={submit}>
        {buttonText}
      </button>
    </div>
  );
}

TaskCreate.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
