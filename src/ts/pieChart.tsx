import React from 'react';

interface IPieChartProps {
  amount: number
}

const PieChart: React.FC<IPieChartProps> = ({ amount }) => {

  return (
    <section>
      <svg
        className="pie-chart"
        viewBox="0 0 33.83098862 33.83098862"
        width="200"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="pie-chart__background"
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
          strokeDasharray={`${amount},100`}
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
            y="17.5"
            alignmentBaseline="central"
            textAnchor="middle"
            fontSize="8"
          >{amount}%</text>
        </g>
      </svg>
    </section>
  );
};

export default PieChart;