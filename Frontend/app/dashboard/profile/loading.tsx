export default function Loading() {
  return (
    <div className="space-y-4 p-1">
      <h1 className="text-xl font-bold">Profile</h1>
      <div className="animate-pulse">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-200 h-32 relative"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col items-center -mt-16">
              <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mt-1"></div>
            </div>
            <div className="mt-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="p-2 bg-gray-200 rounded-full mr-3 w-10 h-10"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-5 bg-gray-200 rounded w-48"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
