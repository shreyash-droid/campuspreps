"use client";

export default function SubjectGrid({ subjects }) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {subjects.map((subject, index) => (
        <div key={index} className="bg-gray-700 text-white py-4 px-6 rounded-lg flex justify-between items-center">
          <span className="text-lg font-semibold">{subject}</span>
          <span className="text-2xl">{">"}</span>
        </div>
      ))}
    </div>
  );
}
