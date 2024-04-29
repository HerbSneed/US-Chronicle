import { useState, useEffect } from "react";

// Custom hook to track window size
export const useWindowSize = () => {
 // State to hold window size
 const [windowSize, setWindowSize] = useState({
  width: window.innerWidth, // Initial width
  height: window.innerHeight, // Initial height
 });

 // Effect to update window size when it changes
 useEffect(() => {
  // Function to update window size
  const handleResize = () => {
   // Update window size state
   setWindowSize({
    width: window.innerWidth, // New width
    height: window.innerHeight, // New height
   });
  };

  // Add event listener for window resize
  window.addEventListener("resize", handleResize);

  // Clean-up function to remove event listener when component unmounts
  return () => {
   window.removeEventListener("resize", handleResize);
  };
 }, []); // Empty dependency array to run effect only once

 // Return window size state
 return windowSize;
};
