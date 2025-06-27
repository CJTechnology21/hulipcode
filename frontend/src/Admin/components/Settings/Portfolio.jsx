import React from "react";

function Portfolio() {
  return (
    <>
      <div className="flex items-center justify-between mb-6 font-fredoka">
        <div className="flex items-center space-x-4"></div>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Enter Project Name"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assigned By
            </label>
            <input type="text" placeholder="Assigned By" className="input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Write here"
            className="input resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          SUBMIT
        </button>
      </form>
    </>
  );
}

export default Portfolio;
