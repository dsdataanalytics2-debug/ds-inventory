import Link from 'next/link'
import { useRouter } from 'next/router'
import { LogOut, User, Activity, Users } from 'lucide-react'
import { getUser, logout, canAddEdit, canManageUsers, canCreateUsers, canViewOwnActivities } from '../utils/auth'

const Navbar = () => {
  const router = useRouter()
  const user = getUser()

  const isActive = (pathname: string) => {
    return router.pathname === pathname
  }

  const handleLogout = () => {
    logout()
  }

  const handleActivityClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/activity')
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
               Automation System
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
            {canAddEdit() && (
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
            )}
            {canAddEdit() && (
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
            )}
            <Link
              href="/daily-history"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/daily-history') 
                  ? 'bg-blue-700' 
                  : 'hover:bg-blue-500'
              }`}
            >
              Transaction History
            </Link>
            <Link
              href="/liquid-demo"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/liquid-demo') 
                  ? 'bg-blue-700' 
                  : 'hover:bg-blue-500'
              }`}
            >
              🧪 Liquid Charts
            </Link>
            {canViewOwnActivities() && (
              <button
                onClick={handleActivityClick}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/activity') 
                    ? 'bg-blue-700' 
                    : 'hover:bg-blue-500'
                }`}
              >
                <Activity className="w-4 h-4 mr-1" />
                Activity
              </button>
            )}
            {canCreateUsers() && (
              <Link
                href="/users"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/users') 
                    ? 'bg-blue-700' 
                    : 'hover:bg-blue-500'
                }`}
              >
                <Users className="w-4 h-4 mr-1" />
                Users
              </Link>
            )}
            
            {/* User Info and Logout */}
            <div className="flex items-center space-x-2 ml-4 border-l border-blue-500 pl-4">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-1" />
                <span>{user?.username}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-blue-500 rounded-full">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
