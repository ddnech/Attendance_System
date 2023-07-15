import React, { useState, useEffect } from "react";

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the current time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className="bg-steel_b py-4 px-6 flex justify-between items-center">
      <h2 className="text-white text-2xl font-bold">Welcome Admin</h2>
      <div className="text-white font-medium">
        <span className="mr-1">{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>
    </div>
  );
}

export default Header;
