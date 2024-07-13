/* eslint-disable react/no-unescaped-entities */
import React from "react";

function Rules() {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mx-auto max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Rules:</h2>
      <div className="space-y-4">
        <RuleItem number="1">
          Enter the room code and mobile number to start chatting.
        </RuleItem>
        <RuleItem number="2">
          You can chat with anyone who enters the same code or mobile number.
        </RuleItem>
        <RuleItem number="3">
          If someone enters the code or mobile number, you can chat with them
          individually.
        </RuleItem>
        <RuleItem number="4">
          Respect others' opinions and engage respectfully in conversations.
        </RuleItem>
        <RuleItem number="5">
          No spamming or flooding the chat with messages.
        </RuleItem>
        <RuleItem number="6">
          Avoid sharing personal information like addresses or phone numbers.
        </RuleItem>
        <RuleItem number="7">
          Use appropriate language and avoid offensive or abusive behavior.
        </RuleItem>
        <RuleItem number="8">
          Be mindful of the community guidelines and moderators' instructions.
        </RuleItem>
      </div>
    </div>
  );
}

function RuleItem({ number, children }: any) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="rounded-full bg-blue-500 text-white flex items-center justify-center h-8 w-8 font-bold">
          {number}
        </div>
      </div>
      <div className="ml-3">
        <p className="font-serif text-lg mb-2">{children}</p>
      </div>
    </div>
  );
}

export default Rules;
