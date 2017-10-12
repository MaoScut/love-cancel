import React from 'react';

export default function Score({ optionTimes, clearNum }) {
  return (
    <div className="score">
      <h2>操作次数：{optionTimes}</h2>
      <h2>消除总数：{clearNum}</h2>
    </div>
  );
}
