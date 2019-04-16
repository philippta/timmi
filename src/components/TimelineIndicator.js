import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

export default function TimelineIndicator({ startOfDay, endOfDay }) {
  const sod = dayjs()
    .startOf('day')
    .set('hour', parseInt(startOfDay, 10));

  const eod = dayjs()
    .startOf('day')
    .set('hour', parseInt(endOfDay, 10));

  const indicators = [];
  for (let i = sod.hour(); i <= eod.hour(); i += 1) {
    indicators.push(
      <div key={i} className="timeline-indicator" data-time={i} />
    );
  }

  return <div className="timeline-indicator-wrapper">{indicators}</div>;
}

TimelineIndicator.propTypes = {
  startOfDay: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  endOfDay: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};
