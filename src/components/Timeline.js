import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

export default function Timeline({
  tasks,
  startOfDay,
  endOfDay,
  highlightedTask }) {
  const sod = dayjs()
    .startOf('day')
    .set('hour', parseInt(startOfDay, 10));

  const eod = dayjs()
    .startOf('day')
    .set('hour', parseInt(endOfDay, 10));

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
            border: (task.id === highlightedTask) ? '1px solid grey' : 'none'
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
  startOfDay: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  endOfDay: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};