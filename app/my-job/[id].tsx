// components/PeopleList.js
// "use-clinet"
import React from "react";

const people = [
  { name: "John Doe", email: "john.doe@example.com" },
  { name: "Jane Smith", email: "jane.smith@example.com" },
  { name: "Bob Johnson", email: "bob.johnson@example.com" },
  // Add more people here...
];

const PeopleList = () => {
  return (
    <ul className="space-y-4">
      {people.map((person, index) => (
        <li key={index} className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">{person.name}</h3>
          <p className="text-gray-600">{person.email}</p>
        </li>
      ))}
    </ul>
  );
};

export default PeopleList;
