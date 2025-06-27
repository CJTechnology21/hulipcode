import React from "react";

function Browse() {
  return (
    <section className="w-full font-[Poppins] px-4 md:px-8 py-12">
      {/* Browse the Range */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold">Browse The Range</h2>
        <p className="text-gray-500 text-sm mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
        {[
          {
            title: "Dining",
            img: "https://cdn.media.amplience.net/i/boconcept/8277aefc-5161-4c90-acbe-ae6d00c22995?w=3020&fmt=auto&upscale=false&sm=c&qlt=75&h=2265&%24auto-poi%24=",
          },
          {
            title: "Living",
            img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
          },
          {
            title: "Bedroom",
            img: "https://www.hindustantimes.com/ht-img/img/2023/07/29/550x309/spacejoy-XM-miHibz64-unsplash_1690612862052_1690612876693.jpg",
          },
        ].map((item, idx) => (
          <div key={idx} className="text-center">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-56 object-cover rounded-lg mb-3"
            />
            <p className="font-medium">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Browse;
