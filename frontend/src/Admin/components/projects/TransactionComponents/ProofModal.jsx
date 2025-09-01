import React from "react";

function ProofModal({ isOpen, proof, onClose }) {
  if (!isOpen || !proof) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Display image or PDF */}
        {proof.fileUrl.endsWith(".pdf") ? (
          <iframe
            src={proof.fileUrl}
            className="w-full h-[80vh]"
            title="Proof"
          ></iframe>
        ) : (
          <img
            src={proof.fileUrl}
            alt="Proof"
            className="max-h-[80vh] w-auto mx-auto"
          />
        )}
      </div>
    </div>
  );
}

export default ProofModal;
