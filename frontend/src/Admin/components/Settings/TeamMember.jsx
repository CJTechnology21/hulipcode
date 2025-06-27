function TeamMember() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img src="https://i.pravatar.cc/80" alt="Profile" className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-lg font-semibold">Steven Smith</h2>
            <p className="text-gray-500">Australia</p>
          </div>
        </div>
        <button className="flex items-center px-4 py-1 border rounded hover:bg-gray-100 text-sm">
          Edit
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.83a4 4 0 01-1.414.943l-3.758 1.253 1.253-3.758a4 4 0 01.943-1.414z"
            />
          </svg>
        </button>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Firm Name</label>
            <input type="text" placeholder="Enter name" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" placeholder="Search city, state" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Firm phone number</label>
            <input type="text" placeholder="Enter number" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Working Expense</label>
            <input type="text" placeholder="Enter working expense" className="input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea rows={3} placeholder="Write here" className="input resize-none" />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
          SUBMIT
        </button>
      </form>
    </>
  );

}

export default TeamMember;
