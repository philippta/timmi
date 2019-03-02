import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

window.dayjs = dayjs;

function toHumanTime(duration, showSeconds) {
  const hour = 60 * 60;
  const minute = 60;

  const hours = Math.floor(duration / hour);
  const minutes = Math.floor((duration - hours * hour) / minute);
  const seconds = duration % 60;

  let str = '';
  if (hours > 0) {
    str += `${hours}h`;
  }
  if (minutes > 0) {
    str += `${minutes}m`;
  }
  if (showSeconds && seconds > 0) {
    str += `${seconds}s`;
  }
  return str;
}

function Task({
  title,
  onTitleChange,
  start,
  onStartChange,
  end,
  onEndChange,
  active,
  onActiveChange,
  onDelete,
  showSeconds,
}) {
  const getAction = e => {
    const key = e.which || e.keyCode || 0;
    const shift = e.shiftKey;
    let modifier = 0;
    if (key === 38) modifier = 1;
    if (key === 40) modifier = -1;
    return [modifier, shift];
  };

  const handleStartChange = e => {
    const [modifier, useHour] = getAction(e);
    const newStart = start.add(modifier, useHour ? 'hour' : 'minute');
    if (end.diff(newStart) < 0) return;
    onStartChange(newStart);
  };

  const handleEndChange = e => {
    const [modifier, useHour] = getAction(e);
    const newEnd = end.add(modifier, useHour ? 'hour' : 'minute');
    if (start.diff(newEnd) > 0) return;
    onEndChange(newEnd);
  };

  const timeDiff = toHumanTime(end.diff(start, 'second'), showSeconds);

  return (
    <div className="task-item">
      <input
        type="text"
        className="task-item-title"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
      />
      {timeDiff && <span className="task-item-duration">{timeDiff}</span>}
      <div className="task-item-input-container">
        <input
          className="task-item-input"
          value={start.format('HH:mm')}
          onKeyDown={handleStartChange}
          readOnly
        />
        −
        <input
          className="task-item-input"
          value={end.format('HH:mm')}
          onKeyDown={handleEndChange}
          readOnly
        />
        <button
          className={`task-item-toggle ${active && 'active'}`}
          type="button"
          onClick={() => onActiveChange(!active)}
        >
          {active ? 'Stop' : 'Start'}
        </button>
        <button className="task-item-delete" type="button" onClick={onDelete}>
          ×
        </button>
      </div>
    </div>
  );
}

Task.propTypes = {
  title: PropTypes.string.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  start: PropTypes.instanceOf(dayjs).isRequired,
  onStartChange: PropTypes.func.isRequired,
  end: PropTypes.instanceOf(dayjs).isRequired,
  onEndChange: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  onActiveChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  showSeconds: PropTypes.bool,
};

Task.defaultProps = {
  showSeconds: true,
};

function TaskCreate({ onSubmit }) {
  const [title, setTitle] = useState('');
  const submit = () => {
    if (title === '') return;
    onSubmit(title);
    setTitle('');
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
      <button type="button" className="task-create-submit" onClick={submit}>
        Start Timer
      </button>
    </div>
  );
}

TaskCreate.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

function getStoredTasks() {
  const tasks = JSON.parse(window.localStorage.getItem('tasks'));
  return tasks === null
    ? []
    : tasks.map(task => ({
        ...task,
        start: dayjs(task.start),
        end: dayjs(task.end),
      }));
}

function getStoredNextId() {
  const nextId = JSON.parse(window.localStorage.getItem('nextId'));
  return nextId === null ? 1 : nextId;
}

function getStoredShowSeconds() {
  const showSeconds = JSON.parse(window.localStorage.getItem('showSeconds'));
  return showSeconds === null ? true : showSeconds;
}

function App() {
  const [showSeconds, setShowSeconds] = useState(getStoredShowSeconds());
  const [nextId, setNextId] = useState(getStoredNextId());
  const [tasks, setTasks] = useState(getStoredTasks());

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(ts =>
        ts.map(task =>
          task.active ? { ...task, end: task.end.add(1, 'second') } : task
        )
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('nextId', JSON.stringify(nextId));
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
    window.localStorage.setItem('showSeconds', JSON.stringify(showSeconds));
  });

  const handleTitleChange = (task, newTitle) => {
    setTasks(
      tasks.map(t => (task.id === t.id ? { ...task, title: newTitle } : t))
    );
  };

  const handleTimeChange = (task, which, time) => {
    setTasks(
      tasks.map(t => (task.id === t.id ? { ...task, [which]: time } : t))
    );
  };

  const handleActiveChange = (task, active) => {
    setTasks(tasks.map(t => (task.id === t.id ? { ...task, active } : t)));
  };

  const handleDelete = task => {
    setTasks(tasks.filter(t => task.id !== t.id));
  };

  const handleTaskSubmit = title => {
    setTasks([
      ...tasks,
      {
        id: nextId,
        title,
        start: dayjs(),
        end: dayjs(),
        active: true,
      },
    ]);
    setNextId(nextId + 1);
  };

  return (
    <div className="app">
      <TaskCreate onSubmit={handleTaskSubmit} />
      <div className="task-list">
        {tasks.map(task => (
          <Task
            key={task.id}
            title={task.title}
            start={task.start}
            end={task.end}
            active={task.active}
            onTitleChange={title => handleTitleChange(task, title)}
            onStartChange={time => handleTimeChange(task, 'start', time)}
            onEndChange={time => handleTimeChange(task, 'end', time)}
            onActiveChange={active => handleActiveChange(task, active)}
            onDelete={() => handleDelete(task)}
            showSeconds={showSeconds}
          />
        ))}
      </div>
      {tasks.length > 0 && (
        <div className="task-summary">
          <div className="task-summary-description">Total</div>
          <div className="task-summary-value">
            {toHumanTime(
              tasks.reduce(
                (sum, task) => sum + task.end.diff(task.start, 'second'),
                0
              ),
              true
            )}
          </div>
          <div className="task-summary-spacer" />
        </div>
      )}
      <div className="options">
        <label htmlFor="showSeconds">
          <input
            type="checkbox"
            id="showSeconds"
            checked={showSeconds}
            onChange={e => setShowSeconds(e.target.checked)}
          />
          Display Seconds
        </label>
        <div className="info">
          <div>Use your arrow keys (+ shift) to modify timestamps</div>
        </div>
      </div>
    </div>
  );
}

export default App;
