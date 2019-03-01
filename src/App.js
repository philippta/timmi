import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

window.dayjs = dayjs;

const startTime = dayjs().set('second', 0);
const endTime = dayjs();

function toHumanTime(diff) {
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  let str = '';
  if (hours > 0) {
    str += `${hours}h`;
  }
  if (minutes > 0) {
    str += `${minutes}m`;
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

  const timeDiff = toHumanTime(end.diff(start, 'minute'));

  return (
    <div className="task-item">
      <input
        type="text"
        className="task-item-title"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
      />
      <div className="task-item-input-container">
        {timeDiff && <span className="task-item-duration">{timeDiff}</span>}
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
      </div>
      <button
        className="task-item-toggle"
        type="button"
        onClick={() => onActiveChange(!active)}
      >
        {active ? 'Stop' : 'Start'}
      </button>
      <br />
      <br />
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
};

function App() {
  const [title, setTitle] = useState('');
  const [nextId, setNextId] = useState(3);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Task 1',
      start: startTime,
      end: endTime,
      active: false,
    },
    {
      id: 2,
      title: 'Task 2',
      start: startTime,
      end: endTime,
      active: false,
    },
  ]);

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

  const handleTitleChange = (task, newTitle) => {
    setTasks(tasks.map(t => (task.id === t.id ? { ...task, newTitle } : t)));
  };

  const handleTimeChange = (task, which, time) => {
    setTasks(
      tasks.map(t => (task.id === t.id ? { ...task, [which]: time } : t))
    );
  };

  const handleActiveChange = (task, active) => {
    setTasks(tasks.map(t => (task.id === t.id ? { ...task, active } : t)));
  };

  const handleTaskSubmit = () => {
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
    setTitle('');
  };

  return (
    <div className="app">
      <div className="task-create">
        <input
          type="text"
          className="task-create-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button
          type="button"
          className="task-create-submit"
          onClick={handleTaskSubmit}
        >
          Start Timer
        </button>
      </div>
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
          />
        ))}
      </div>
      <div className="task-summary">
        Total:{' '}
        {toHumanTime(
          tasks.reduce(
            (sum, task) => sum + task.end.diff(task.start, 'minute'),
            0
          )
        )}
      </div>
    </div>
  );
}

export default App;
