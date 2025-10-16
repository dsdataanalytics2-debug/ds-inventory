import Link from 'next/link'
import { useRouter } from 'next/router'

const Navbar = () => {
  const router = useRouter()

  const isActive = (pathname: string) => {
    return router.pathname === pathname
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Inventory Dashboard
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-blue-700' 
                  : 'hover:bg-blue-500'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/add"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/add') 
                  ? 'bg-blue-700' 
                  : 'hover:bg-blue-500'
              }`}
            >
              Add Product
            </Link>
            <Link
              href="/sell"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/sell') 
                  ? 'bg-blue-700' 
                  : 'hover:bg-blue-500'
              }`}
            >
              Sell Product
            </Link>
            <Link
              href="/daily-history"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/daily-history') 
                  ? 'bg-blue-700' 
                  : 'hover:bg-blue-500'
              }`}
            >
              Daily History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
