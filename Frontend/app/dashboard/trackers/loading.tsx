export default function Loading() {
  return (
    <div className="space-y-4 p-1">
      <h1 className="text-xl font-bold">Trackers</h1>
      <div className="animate-pulse">
        <div className="flex border-b mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-4 py-2 w-32 h-10 bg-gray-200 rounded-lg mr-2"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
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
