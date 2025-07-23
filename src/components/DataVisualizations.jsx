import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
         PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import './DataVisualizations.css'

function DataVisualizations({ breweries }) {
  const [activeChart, setActiveChart] = useState('type')

  // Data preparation for Brewery Types Chart
  const typeData = Object.entries(
    breweries.reduce((acc, brewery) => {
      const type = brewery.brewery_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Data preparation for State Distribution Chart
  const stateData = Object.entries(
    breweries.reduce((acc, brewery) => {
      const state = brewery.state || 'unknown';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 states

  // Data for historical openings - with fix for timeline data
  console.log("Sample brewery dates:", breweries.slice(0, 3).map(b => b.created_at));

  // Timeline data with fallback for limited date diversity
  let timelineData = [];

  // First check if we have real date diversity
  const uniqueDates = new Set(
    breweries
      .filter(b => b.created_at)
      .map(b => new Date(b.created_at).getFullYear())
  );

  if (uniqueDates.size <= 1) {
    // Not enough real date diversity, create synthetic data for demo
    console.log("Not enough date diversity, creating synthetic timeline");
    // Create synthetic timeline spanning last 5 years
    const currentYear = new Date().getFullYear();
    timelineData = Array.from({length: 6}, (_, i) => {
      const year = currentYear - 5 + i;
      // Generate some random but increasing numbers
      const baseCount = 5 + i * 2;
      const randomVariation = Math.floor(Math.random() * 5);
      return {
        year: year.toString(),
        count: baseCount + randomVariation
      };
    });
  } else {
    // Use actual data
    const yearData = breweries.reduce((acc, brewery) => {
      if (brewery.created_at) {
        const year = new Date(brewery.created_at).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {});

    timelineData = Object.keys(yearData)
      .sort()
      .map(year => ({ year, count: yearData[year] }));
  }

  console.log("Final timeline data:", timelineData);

  // Colors for pie chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#A4DE6C', '#D0ED57', '#FFC658', '#8DD1E1'
  ];

  const renderActiveChart = () => {
    switch(activeChart) {
      case 'type':
        return (
          <div className="chart-container">
            <h3>Distribution by Brewery Type</h3>
            <p className="chart-insight">
              This chart shows the distribution of breweries by type. Micro breweries are the most common,
              followed by brewpubs. This reflects the craft beer boom in recent years.
            </p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={typeData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Number of Breweries" fill="#0277bd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'state':
        return (
          <div className="chart-container">
            <h3>Top 10 States by Number of Breweries</h3>
            <p className="chart-insight">
              This chart highlights which states have the most breweries in our database.
              States like California, Colorado, and Oregon tend to lead, reflecting their
              strong craft beer cultures.
            </p>
            <div className="chart-wrapper">
              <div className="dual-chart">
                <div className="chart-half">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stateData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Number of Breweries" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-half">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={stateData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} breweries`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="chart-container">
            <h3>Brewery Growth Timeline</h3>
            <p className="chart-insight">
              {uniqueDates.size <= 1
                ? "This chart shows a simulated timeline of brewery growth for demonstration purposes. In a real dataset, this would track when breweries were established."
                : "This timeline shows when breweries were added to the database over time. The trend reflects the growing popularity of craft breweries."
              }
            </p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} breweries`, 'Count']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Breweries Added"
                    stroke="#ff7300"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return <div>Select a chart to view</div>;
    }
  };

  return (
    <div className="data-visualizations">
      <div className="chart-selector">
        <button
          className={activeChart === 'type' ? 'active' : ''}
          onClick={() => setActiveChart('type')}
        >
          Brewery Types
        </button>
        <button
          className={activeChart === 'state' ? 'active' : ''}
          onClick={() => setActiveChart('state')}
        >
          States Distribution
        </button>
        <button
          className={activeChart === 'timeline' ? 'active' : ''}
          onClick={() => setActiveChart('timeline')}
        >
          Timeline
        </button>
      </div>

      {renderActiveChart()}

      <div className="chart-explanation">
        <h3>About the Data</h3>
        <p>
          This dashboard uses data from the Open Brewery DB, a free API for public information on breweries.
          The visualization tools help you explore patterns in brewery distribution across the United States.
        </p>
        <p>
          <strong>Tips for exploration:</strong>
        </p>
        <ul>
          <li>Use the filters above to narrow down breweries by state or type</li>
          <li>Compare brewery types to see which are most common</li>
          <li>Look for regional patterns in brewery distribution</li>
          <li>Click on any brewery card to see more detailed information</li>
        </ul>
      </div>
    </div>
  )
}

export default DataVisualizations
