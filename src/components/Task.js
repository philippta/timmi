import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { toHumanTime } from '../helpers';

export default function Task({
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
  onHover,
  offHover
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
    <div className="task-item"
      onMouseEnter={onHover}
      onMouseLeave={offHover}>
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