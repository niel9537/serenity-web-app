import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';

const LineChart = ({ transactions }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      return;
    }

    // Create an array of labels for the months January to December of the current year
    const labels = [];
    const currentYear = moment().year();
    for (let i = 0; i < 12; i++) {
      const month = moment().month(i).year(currentYear).format('MMMM YYYY');
      labels.push(month);
    }

    // Group transactions by month and calculate total transaction amount for each month
    const groupedData = transactions.reduce((acc, transaction) => {
      const month = moment(transaction.transactionDate).format('MMMM YYYY');
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += transaction.totalPrice;
      return acc;
    }, {});

    // Create an array of data corresponding to the labels
    const data = labels.map(label => groupedData[label] || 0);

    // Ensure that the chart instance is available and initialized
    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy any existing chart instance
    }

    // Create a new chart instance
    const ctx = chartContainer.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line', // Use line type for line chart
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Monthly Transaction Totals',
            data: data,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: false, // Hide legend for better layout
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return 'Rp ' + tooltipItem.formattedValue; // Format tooltip value as Rp X.XX
              },
            },
          },
          annotation: {
            annotations: labels.map((label, index) => ({
              type: 'line',
              mode: 'vertical',
              scaleID: 'x',
              value: label,
              borderColor: 'rgba(255, 99, 132, 0.7)',
              borderWidth: 1,
              label: {
                content: label.split(' ')[0], // Display only the month part
                enabled: true,
                position: 'top',
              },
            })),
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'rgba(255,255,255,.7)',
              autoSkip: false, // Disable auto skipping of labels
              maxRotation: 0, // Rotate x-axis labels to fit
              callback: function(value) {
                return value; // Display the month labels
              },
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.15)',
              display: true,
            },
          },
          y: {
            ticks: {
              color: 'rgba(255,255,255,.7)',
              callback: function(value, index, values) {
                return 'Rp ' + value.toLocaleString(); // Format currency as Rp X,XXX,XXX
              },
            },
            grid: {
              display: true,
              color: 'rgba(255, 255, 255, 0.15)',
            },
          },
        },
      },
    });

    // Clean up chart instance on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions]);

  // Render the chart canvas with specified height
  return (
    <div className="border mx-3 my-2 rounded-md p-4" style={{ height: '500px' }}>
      <h2 className="text-lg font-semibold mb-4">Total Transaksi Perbulan 2024</h2>
      <canvas ref={chartContainer} id="line-chart" />
    </div>
  );
};

export default LineChart;
