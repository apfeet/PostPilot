import React, { useState, useRef, useEffect } from 'react';

const AboutUsModal = ({ buttonText, title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <button
        onClick={openModal}
        className="rounded-full bg-white px-4 py-1 text-sm font-semibold shadow-md transition-all duration-300 hover:bg-gray-400 md:px-6 md:py-2 md:text-lg"
      >
        {buttonText}
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="w-4/5 max-w-2xl rounded-lg bg-white p-4 shadow-md md:p-8"
          >
            <h2 className="mb-4 text-2xl font-semibold justify-center flex">{title}</h2>
            <div class="text-gray-600 space-y-4 leading-relaxed">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsModal;