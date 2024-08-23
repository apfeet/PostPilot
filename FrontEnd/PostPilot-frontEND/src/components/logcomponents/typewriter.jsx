import React, { useEffect, useState } from "react";

// Custom Hook for handling typewriter logic
const useTypewriter = ({ words, typeSpeed, deleteSpeed, pause }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout;

    const handleTyping = () => {
      setDisplayedText((prev) => currentWord.slice(0, prev.length + 1));
      if (displayedText === currentWord) {
        setIsDeleting(true);
        timeout = setTimeout(() => {}, pause);
      }
    };

    const handleDeleting = () => {
      setDisplayedText((prev) => prev.slice(0, -1));
      if (displayedText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }
    };

    if (isDeleting) {
      timeout = setTimeout(handleDeleting, deleteSpeed);
    } else {
      timeout = setTimeout(handleTyping, typeSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentWordIndex, words, typeSpeed, deleteSpeed, pause]);

  return displayedText;
};

// Custom Hook for handling cursor blinking
const useCursorBlinking = () => {
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const cursorBlinking = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorBlinking);
  }, []);

  return cursorVisible;
};

// Main Typewriter component
const Typewriter = ({ words, typeSpeed = 200, deleteSpeed = 100, pause = 1000 }) => {
  const displayedText = useTypewriter({ words, typeSpeed, deleteSpeed, pause });
  const cursorVisible = useCursorBlinking();

  return (
    <span style={{ position: "relative", lineHeight: "1em", display: "inline-flex" }}>
      <span>{displayedText}</span>
      <span
        className="bg-[#90BEDE]"
        style={{
          width: "2px",
          height: "1em",
          marginLeft: "2px",
          visibility: cursorVisible ? "visible" : "hidden",
          alignSelf: "flex-start",
        }}
      ></span>
    </span>
  );
};

export default Typewriter;