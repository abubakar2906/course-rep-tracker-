export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
        <div className="h-6 bg-gray-200 rounded w-48"></div>
      </div>

      <div className="animate-pulse">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-24 bg-gray-200 rounded w-full"></div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <div className="h-10 bg-gray-200 rounded w-24 mr-2"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
