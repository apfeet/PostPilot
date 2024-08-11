import React, { useEffect, useState } from "react";

const Typewriter = ({
  words, // Array of words to be typed out
  typeSpeed = 200, // Speed at which characters are typed (in milliseconds)
  deleteSpeed = 100, // Speed at which characters are deleted (in milliseconds)
  pause = 1000, // Pause duration before deleting a word (in milliseconds)
}) => {
  // State to manage the currently displayed text
  const [displayedText, setDisplayedText] = useState("");
  // State to track the index of the current word in the words array
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  // State to track whether the text is currently being deleted
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Get the current word based on the currentWordIndex
    const currentWord = words[currentWordIndex];
    let timeout;

    // Check if we are currently deleting text
    if (isDeleting) {
      timeout = setTimeout(() => {
        // Remove the last character from displayedText
        setDisplayedText((prev) => prev.slice(0, -1));
        // If the displayedText is empty, switch to typing the next word
        if (displayedText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
      }, deleteSpeed);
    } else {
      timeout = setTimeout(() => {
        // Add the next character from the currentWord to displayedText
        setDisplayedText((prev) => currentWord.slice(0, prev.length + 1));
        // If the displayedText matches the currentWord, start deleting after a pause
        if (displayedText === currentWord) {
          setIsDeleting(true);
          timeout = setTimeout(() => {}, pause); // Pause before starting to delete
        }
      }, typeSpeed);
    }

    // Cleanup function to clear the timeout when component unmounts or dependencies change
    return () => clearTimeout(timeout);
  }, [
    displayedText, // Dependency: triggers effect when displayedText changes
    isDeleting, // Dependency: triggers effect when isDeleting changes
    currentWordIndex, // Dependency: triggers effect when currentWordIndex changes
    words, // Dependency: triggers effect when words array changes
    typeSpeed, // Dependency: triggers effect when typeSpeed changes
    deleteSpeed, // Dependency: triggers effect when deleteSpeed changes
    pause, // Dependency: triggers effect when pause duration changes
  ]);

  return (
    <span
      style={{
        position: "relative",
        lineHeight: "1em",
      }}
    >
      {/* Display the current text */}
      {displayedText}
      <span
        className="bg-[#90BEDE]"
        style={{
          position: "absolute",
          width: "7px",
          height: "1.1em",
          right: "-7px", // Adjust as needed to align properly
          top: "0",
        }}
      ></span>
    </span>
  );
};

export default Typewriter;
