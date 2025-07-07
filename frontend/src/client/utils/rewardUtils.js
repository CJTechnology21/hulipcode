import axios from "axios";

export const fetchUserRewardPoints = async () => {
  const token = localStorage.getItem("crm_token");
  if (!token) return 0;

  try {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.rewardPoints || 0;
  } catch (err) {
    console.error("Error fetching reward points:", err);
    return 0;
  }
};
