import React, { useState } from 'react';
import './about-us.css'; // Ensure this path is correct

const AboutUsModal = ({ buttonText, title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleClickOutside = (e) => {
        // Check if the click is outside the modal content
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    };

    return (
        <div>
            <button
                onClick={openModal}
                className="modal-button"
            >
                {buttonText}
            </button>

            {isOpen && (
                <div
                    className="modal-overlay"
                    onClick={handleClickOutside} // Handle click outside to close modal
                >
                    <div
                        className="modal-content"
                        onClick={e => e.stopPropagation()} // Prevent click inside from closing the modal
                    >
                        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                        <div className="text-gray-700">{children}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutUsModal;