import React from "react";

function ConversationBanner() {
  return (
    <section className="text-center py-16 bg-white">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        Lets Start The Conversation!
      </h2>

      {/* Subtext */}
      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
        Have a story to share or a question to ask? Reach out we're always
        listening and excited to hear from you!
      </p>

      {/* Button */}
      <a
        href="#contact"
        className="inline-block bg-black text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-800 transition"
      >
        Contact Us
      </a>
    </section>
  );
}

export default ConversationBanner;
