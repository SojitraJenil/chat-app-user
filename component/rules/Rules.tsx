import React from "react";

function Rules() {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mx-auto max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Notes:</h2>
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="rounded-full bg-blue-500 text-white flex items-center justify-center h-8 w-8 font-bold">
              1
            </div>
          </div>
          <div className="ml-3">
            <p className="font-serif text-lg mb-2">
              Create a function to generate a unique numeric code for each user
              or group chat. This code can be a specific length, such as 10
              digits.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="rounded-full bg-blue-500 text-white flex items-center justify-center h-8 w-8 font-bold">
              2
            </div>
          </div>
          <div className="ml-3">
            <p className="font-serif text-lg mb-2">
              Store this secret code in your database, associating it with the
              users or groups who are allowed to use it.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="rounded-full bg-blue-500 text-white flex items-center justify-center h-8 w-8 font-bold">
              3
            </div>
          </div>
          <div className="ml-3">
            <p className="font-serif text-lg mb-2">
              When a user wants to start a private chat, they will need to enter
              the secret code. Validate this code against the database to ensure
              it is correct.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="rounded-full bg-blue-500 text-white flex items-center justify-center h-8 w-8 font-bold">
              4
            </div>
          </div>
          <div className="ml-3">
            <p className="font-serif text-lg mb-2">
              Once the code is validated, establish a private chat session
              between the users.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="rounded-full bg-blue-500 text-white flex items-center justify-center h-8 w-8 font-bold">
              5
            </div>
          </div>
          <div className="ml-3">
            <p className="font-serif text-lg mb-2">
              For group chats, generate a unique code for the group and validate
              it similarly. Users can join the group chat by entering the
              group’s secret code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rules;
