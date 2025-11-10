export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
        <div className="h-6 bg-gray-200 rounded w-48"></div>
      </div>

      <div className="animate-pulse">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-yellow-200 p-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white"></div>
              <div className="text-center md:text-left">
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-56"></div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="flex justify-center p-2 bg-white rounded-lg">
                  <div className="w-36 h-36 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-48 mt-2 mx-auto"></div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg mb-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 mt-4">
          <div className="h-5 bg-gray-200 rounded w-48 mb-4"></div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
