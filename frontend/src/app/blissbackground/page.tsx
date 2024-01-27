import { Button } from "@/components/ui/button";
import React from "react";

const Page = () => {
  return (
    <div className="flex-col py-40">
      {" "}
      <p className="text-5xl text-gray-700 font-bold">Your Info</p>
      <div className="flex-col justify-center gap0 py-11">
        {" "}
        <p className="text-2xl text-gray-700 font-medium">First name</p>
        <p className="text-lg text-gray-700 font-normal">Andrew</p>{" "}
      </div>
      <div className="flex-col py-12">
        {" "}
        <p className="text-2xl text-gray-700 font-medium">Last name:</p>
        <p className="text-lg text-gray-700 font-normal">Chen</p>{" "}
      </div>
      <div className="flex-col justify-start gap-3.5 py-1.5">
        {" "}
        <p className="text-2xl text-gray-700 font-medium">School name:</p>
        <p className="text-lg text-gray-700 font-normal">Bayview SS.</p>{" "}
      </div>
      <div className="flex-row justify-start gap-14 px0">
        {" "}
        <Button variant="default">
          Edit
        </Button>
        <Button variant="default">
          Delete
        </Button>{" "}
      </div>{" "}
    </div>
  );
};

export default Page;
