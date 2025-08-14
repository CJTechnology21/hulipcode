import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";

function LeadInfo() {
  const { id } = useParams(); // if you are passing id in route like /leadinfo/:id
  const location = useLocation(); // can also get state if you passed data via navigate
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        // You can switch to your actual API endpoint
        const res = await fetch(`/api/leads/${id}`);
        if (!res.ok) throw new Error("Failed to fetch lead details");
        const data = await res.json();
        setLead(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLeadDetails();
    } else if (location.state?.lead) {
      // If you passed the lead object via navigate, we can use that directly
      setLead(location.state.lead);
      setLoading(false);
    } else {
      setError("No lead information provided");
      setLoading(false);
    }
  }, [id, location.state]);

  return (
    <Layout title="Lead Info">
      <div className="bg-white p-4 m-4 min-h-screen rounded-lg shadow-md">
        {loading && <p className="text-gray-500">Loading lead details...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {lead && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {lead.name || "Unnamed Lead"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-medium">Email</p>
                <p className="text-gray-800">{lead.email || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Phone</p>
                <p className="text-gray-800">{lead.phone || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Status</p>
                <p className="text-gray-800">{lead.status || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Budget</p>
                <p className="text-gray-800">{lead.budget || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Location</p>
                <p className="text-gray-800">{lead.location || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Created At</p>
                <p className="text-gray-800">
                  {lead.createdAt
                    ? new Date(lead.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {lead.notes && (
              <div>
                <p className="text-gray-600 font-medium">Notes</p>
                <p className="text-gray-800">{lead.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default LeadInfo;

// import React from 'react'
// import Layout from '../../components/Layout'

// function LeadInfo() {
//     return (
//         <div>
//             <Layout title="Lead Info">
//                 <div className='bg-white p-4 m-4 min-h-screen rounded-lg shadow-md min-w-9xl'>

//                 </div>
//             </Layout>
//         </div>
//     )
// }

// export default LeadInfo