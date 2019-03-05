import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { toHumanTime, getLocalStore } from './helpers';
import Task from './components/Task';
import TaskCreate from './components/TaskCreate';
import Timeline from './components/Timeline';
import OptionTextInput from './components/OptionTextInput';
import OptionCheckboxInput from './components/OptionCheckboxInput';

function App() {
  const [highlightedTask, setHighlightedTask] = useState(null);
  const [showSeconds, setShowSeconds] = useState(
    getLocalStore('showSeconds', true)
  );
  const [nextId, setNextId] = useState(getLocalStore('nextId', 1));
  const [tasks, setTasks] = useState(
    getLocalStore('tasks', []).map(task => ({
      ...task,
      start: dayjs(task.start),
      end: dayjs(task.end),
    }))
  );
  const [startOfDay, setStartOfDay] = useState(getLocalStore('startOfDay', 9));
  const [endOfDay, setEndOfDay] = useState(getLocalStore('endOfDay', 17));

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

  const changeTaskProp = (task, key, value) =>
    setTasks(
      tasks.map(t => (task.id === t.id ? { ...task, [key]: value } : t))
    );

  const deleteTask = task => setTasks(tasks.filter(t => task.id !== t.id));

  const submitTask = title => {
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
      <Timeline
        tasks={tasks}
        highlightedTask={highlightedTask}
        startOfDay={startOfDay}
        endOfDay={endOfDay} />
      <TaskCreate onSubmit={submitTask} />
      <div className="task-list">
        {tasks.map(task => (
          <Task
            key={task.id}
            title={task.title}
            start={task.start}
            end={task.end}
            active={task.active}
            onTitleChange={title => changeTaskProp(task, 'title', title)}
            onStartChange={time => changeTaskProp(task, 'start', time)}
            onEndChange={time => changeTaskProp(task, 'end', time)}
            onActiveChange={active => changeTaskProp(task, 'active', active)}
            onDelete={() => deleteTask(task)}
            onHover={() => setHighlightedTask(task.id)}
            offHover={() => setHighlightedTask(null)}
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
          <OptionTextInput
            labelKey="startOfDay"
            value={startOfDay}
            onChange={setStartOfDay}
          >
            Start of day hour
          </OptionTextInput>
        </div>
        <div>
          <OptionTextInput
            labelKey="endOfDay"
            value={endOfDay}
            onChange={setEndOfDay}
          >
            End of day hour
          </OptionTextInput>
        </div>
        <div>
          <OptionCheckboxInput
            labelKey="showSeconds"
            checked={showSeconds}
            onChange={setShowSeconds}
          >
            Display Seconds
          </OptionCheckboxInput>
        </div>
        <div className="info">
          <div>Use your arrow keys (+ shift) to modify timestamps</div>
        </div>
      </div>
      <div className="links">
        <a
          rel="noopener noreferrer"
          href="https://gitlab.com/philippta/timmi/"
          target="_blank"
        >
          Repo
        </a>
      </div>
    </div>
  );
}

export default App;