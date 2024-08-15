import React, { useState } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const generateCalendar = (year, month) => {
    const daysInMonth = 31; // Always use 31 days regardless of the month
    const nextMonthDays = [1, 2, 3, 4]; // Dates for the next month
    const calendarDays = [];

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(
        <div
          key={i}
          className="flex aspect-square items-center justify-center border border-gray-200 text-lg"
        >
          {i}
        </div>,
      );
    }

    // Add next month's dates with a different style
    nextMonthDays.forEach((day) => {
      calendarDays.push(
        <div
          key={`next-${day}`}
          className="flex aspect-square items-center justify-center border border-gray-200 bg-gray-50 text-lg text-gray-400"
        >
          {day}
        </div>,
      );
    });

    return calendarDays;
  };

  const changeMonth = (increment) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  return (
    <div className="h-auto w-full overflow-hidden rounded-xl bg-white shadow-md sm:w-72 lg:w-[460px]">
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="flex space-x-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl shadow transition-colors hover:bg-gray-300"
              onClick={() => changeMonth(-1)}
            >
              &lt;
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl shadow transition-colors hover:bg-gray-300"
              onClick={() => changeMonth(1)}
            >
              &gt;
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 font-semibold">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div
              key={day}
              className="flex aspect-square items-center justify-center text-lg text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {generateCalendar(currentDate.getFullYear(), currentDate.getMonth())}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
