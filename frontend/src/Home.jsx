import { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import HomeHeader from "./HomeComponents/HomeHeader";
import HomeFooter from "./HomeComponents/HomeFooter";
import HomeComponent from "./HomeComponents/HomeComponent";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay for loading (e.g., fetching data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen font-montreal flex justify-center items-center">
      {loading ? (
        <ClipLoader color="red" size={50} />
      ) : (
        <div className="w-full">
          <HomeHeader />
          <HomeComponent />
          <HomeFooter />
        </div>
      )}
    </div>
  );
}

export default Home;

// import HomeHeader from "./HomeComponents/HomeHeader";
// import HomeFooter from "./HomeComponents/HomeFooter";
// import HomeComponent from "./HomeComponents/HomeComponent";

// function Home() {
//   return (
//     <div className="bg-white min-h-screen font-montreal">
//       <HomeHeader />
//       <HomeComponent />
//       <HomeFooter />
//     </div>
//   );
// }

// export default Home;
