import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface Product {
  id: number
  name: string
  total_added_qty: number
  total_added_amount: number
  total_sold_qty: number
  total_sold_amount: number
  available_stock: number
  avg_purchase_price?: number
  avg_selling_price?: number
  profit_loss?: number
}

interface SummaryChartProps {
  products: Product[]
}

const SummaryChart = ({ products }: SummaryChartProps) => {
  // Prepare data for enhanced bar chart
  const barChartData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: 'Added Quantity',
        data: products.map(p => p.total_added_qty || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Sold Quantity',
        data: products.map(p => p.total_sold_qty || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Available Stock',
        data: products.map(p => p.available_stock || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      }
    ],
  }

  // Prepare data for pie chart (available stock distribution)
  const pieChartData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: 'Available Stock Distribution',
        data: products.map(p => p.available_stock || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(239, 68, 68)',
          'rgb(34, 197, 94)',
          'rgb(245, 158, 11)',
          'rgb(147, 51, 234)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Inventory Overview',
      },
    },
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Stock Distribution',
      },
    },
  }

  // Prepare financial values chart
  const financialChartData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: 'Added Value ($)',
        data: products.map(p => Number(p.total_added_amount) || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Revenue ($)',
        data: products.map(p => Number(p.total_sold_amount) || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
      },
    ],
  }

  const financialOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Financial Overview ($)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No data available for charts
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <Bar data={barChartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <Pie data={pieChartData} options={pieOptions} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar data={financialChartData} options={financialOptions} />
      </div>
    </div>
  )
}

export default SummaryChart
