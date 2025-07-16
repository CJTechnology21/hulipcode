import React from "react";

function HomeTextSection() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="border border-dashed border-blue-400 rounded-lg p-6 flex flex-col sm:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="sm:w-48 flex flex-col text-sm font-medium space-y-3">
            <button className="text-blue-600">Top skills</button>
            <button className="text-gray-400">Trending skills</button>
            <button className="text-gray-400">Top skills in US</button>
            <button className="text-gray-300">Project Catalog™</button>
          </div>

          {/* Skills List */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 text-sm text-gray-800">
            {[
              "Data Entry Specialists",
              "Video Editors",
              "Data Analyst",
              "Shopify Developer",
              "Ruby on Rails Developer",
              "Android Developer",
              "Bookkeeper",
              "Content Writer",
              "Copywriter",
              "Database Administrator",
              "Data Scientist",
              "Front-End Developer",
              "Game Developer",
              "Graphic Designer",
              "iOS Developer",
              "Java Developer",
              "JavaScript Developer",
              "Logo Designer",
              "Mobile App Developer",
              "PHP Developer",
              "Python Developer",
              "Resume Writer",
              "SEO Expert",
              "Social Media Manager",
              "Software Developer",
              "Software Engineer",
              "Technical Writer",
              "UI Designer",
              "UX Designer",
              "Virtual Assistant",
              "Web Designer",
              "Wordpress Developer",
            ].map((skill, index) => (
              <p key={index}>{skill}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeTextSection;
