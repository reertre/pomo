import React from 'react';
import Chart from 'react-apexcharts';

const DonutChart = () => {
  // Define the chart options and data
  const chartOptions = {
    series: [44, 55, 13, 33],
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4'],
    },
  };

  return (
    <div>
      <Chart
        options={chartOptions.options}
        series={chartOptions.series}
        type="donut"
        width="380"
      />
    </div>
  );
};

export default DonutChart;
