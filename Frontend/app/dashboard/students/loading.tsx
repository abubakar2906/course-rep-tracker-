export default function Loading() {
  return (
    <div className="space-y-4 p-1">
      <h1 className="text-xl font-bold">Students</h1>
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-4 border-b">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
