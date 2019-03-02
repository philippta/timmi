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
    if (end.diff(newStart) < 0 || newStart.diff(dayjs().startOf('day')) < 0)
      return;
    onStartChange(newStart);
  };

  const handleEndChange = e => {
    const [modifier, useHour] = getAction(e);
    const newEnd = end.add(modifier, useHour ? 'hour' : 'minute');
    if (start.diff(newEnd) > 0 || newEnd.diff(dayjs().endOf('day')) > 0) return;
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

function Timeline({ tasks, startOfDay, endOfDay }) {
  const sod = dayjs()
    .startOf('day')
    .set('hour', startOfDay);

  const eod = dayjs()
    .startOf('day')
    .set('hour', endOfDay);

  const pos = time =>
    (time.diff(sod, 'second') / eod.diff(sod, 'second')) * 100;

  const colors = [
    '#D9BBFF',
    '#C0A2FF',
    '#A688FF',
    '#8D6FFF',
    '#7355EA',
    '#5A3CD1',
  ];

  return (
    <div className="timeline">
      {tasks.map((task, i) => (
        <div
          key={task.id}
          className="timeline-item"
          style={{
            left: `${pos(task.start)}%`,
            width: `${pos(task.end) - pos(task.start)}%`,
            backgroundColor: colors[i % colors.length],
          }}
        />
      ))}
    </div>
  );
}

Timeline.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      start: PropTypes.instanceOf(dayjs).isRequired,
      end: PropTypes.instanceOf(dayjs).isRequired,
      active: PropTypes.bool.isRequired,
    })
  ).isRequired,
  startOfDay: PropTypes.number.isRequired,
  endOfDay: PropTypes.number.isRequired,
};

function getStoredTasks() {
  const value = JSON.parse(window.localStorage.getItem('tasks'));
  return value === null
    ? []
    : value.map(task => ({
        ...task,
        start: dayjs(task.start),
        end: dayjs(task.end),
      }));
}

function getStoredNextId() {
  const value = JSON.parse(window.localStorage.getItem('nextId'));
  return value === null ? 1 : value;
}

function getStoredShowSeconds() {
  const value = JSON.parse(window.localStorage.getItem('showSeconds'));
  return value === null ? true : value;
}

function getStoredStartOfDay() {
  const value = JSON.parse(window.localStorage.getItem('startOfDay'));
  return value === null ? 9 : parseInt(value, 10);
}

function getStoredEndOfDay() {
  const value = JSON.parse(window.localStorage.getItem('endOfDay'));
  return value === null ? 17 : parseInt(value, 10);
}

function App() {
  const [showSeconds, setShowSeconds] = useState(getStoredShowSeconds());
  const [nextId, setNextId] = useState(getStoredNextId());
  const [tasks, setTasks] = useState(getStoredTasks());
  const [startOfDay, setStartOfDay] = useState(getStoredStartOfDay());
  const [endOfDay, setEndOfDay] = useState(getStoredEndOfDay());

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
    window.localStorage.setItem('startOfDay', JSON.stringify(startOfDay));
    window.localStorage.setItem('endOfDay', JSON.stringify(endOfDay));
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
      <Timeline tasks={tasks} startOfDay={startOfDay} endOfDay={endOfDay} />
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
      {tasks.length > 1 && (
        <div className="task-summary">
          <div className="task-summary-description" />
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
        <div>
          <label htmlFor="startOfDay">
            Start of day hour
            <input
              type="text"
              id="startOfDay"
              className="options-input"
              value={startOfDay}
              onChange={e => setStartOfDay(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="endOfDay">
            End of day hour
            <input
              type="text"
              id="endOfDay"
              className="options-input"
              value={endOfDay}
              onChange={e => setEndOfDay(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="showSeconds">
            Display Seconds
            <input
              type="checkbox"
              id="showSeconds"
              className="options-input"
              checked={showSeconds}
              onChange={e => setShowSeconds(e.target.checked)}
            />
          </label>
        </div>
        <div className="info">
          <div>Use your arrow keys (+ shift) to modify timestamps</div>
        </div>
      </div>
    </div>
  );
}

export default App;
