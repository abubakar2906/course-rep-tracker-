export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
        <div className="h-6 bg-gray-200 rounded w-48"></div>
      </div>

      <div className="animate-pulse">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>

        {/* Student list */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-4 border-b">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
