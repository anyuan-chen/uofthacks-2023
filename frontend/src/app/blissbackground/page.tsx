import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const Page = () => {
  return (
    <div className="flex-col">
      {" "}
      <div className="flex flex-col gap-y-24">
        <div className="flex flex-col gap-y-5">
          <div className="flex-col">
            {" "}
            <div className="flex flex-col gap-y-3">
              <p className="text-lg text-gray-700 font-normal">First name</p>
              <Input type="text" placeholder="eg. " className="" />
            </div>{" "}
          </div>
          <div className="flex-col">
            {" "}
            <div className="flex flex-col gap-y-1">
              <p className="text-lg text-gray-700 font-normal">Last name:</p>
              <Input type="text" placeholder="Chen" className="" />
            </div>{" "}
          </div>
          <div className="flex-col">
            {" "}
            <div className="flex flex-col gap-y-2">
              <p className="text-lg text-gray-700 font-normal">School name:</p>
              <Input type="text" placeholder="Chen" className="" />
            </div>{" "}
          </div>
        </div>
        <div className="flex-row">
          {" "}
          <div className="flex flex-row gap-x-5">
            <Button variant="default" className="pt-5 pb-5">
              Save
            </Button>
            <Button variant="destructive" className="pt-5 pb-5">
              Cancel
            </Button>
          </div>{" "}
        </div>
      </div>{" "}
    </div>
  );
};

export default Page;
