import React, { useEffect, useState } from 'react';

interface IPieChartProps {
  amount: number
}

const PieChart: React.FC<IPieChartProps> = ({ amount }) => {
  const [amountValue, setAmoutValue] = useState<number>(amount);

  useEffect(() => {
    setAmoutValue(Math.floor(amount));
  }, [amount]);

  return (
    <div>
      <svg
        className="tw-m-auto"
        viewBox="0 0 33.83098862 33.83098862"
        width="200"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          stroke="#efefef"
          strokeWidth="2"
          fill="none"
          cx="16.91549431"
          cy="16.91549431"
          r="15.91549431"
        />
        <circle
          className="pie-chart__circle"
          stroke="#00acc1"
          strokeWidth="2"
          strokeDasharray={`${amountValue},100`}
          strokeLinecap="round"
          fill="none"
          cx="16.91549431"
          cy="16.91549431"
          r="15.91549431"
        />
        <g className="pie-chart__info">
          <text
            className="pie-chart__percent"
            x="16.91549431"
            y="16.91549431"
            alignmentBaseline="central"
            textAnchor="middle"
            fontSize="8"
          >{amountValue}%</text>
        </g>
      </svg>
    </div>
  );
};

export default PieChart;