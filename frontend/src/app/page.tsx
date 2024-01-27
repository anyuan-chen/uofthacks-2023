import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex-col">
      {" "}
      <div className="flex flex-col gap-y-52">
        <div className="flex flex-col gap-y-28">
          <h1 className="text-7xl text-black font-bold">Your Info</h1>
          <div className="flex flex-col gap-y-16">
            <div className="flex-col">
              {" "}
              <div className="flex flex-col gap-y-5">
                <p className="text-5xl text-gray-700 font-medium">First name</p>
                <p className="text-4xl text-gray-700 font-normal">Andrew</p>
              </div>{" "}
            </div>
            <div className="flex-col">
              {" "}
              <div className="flex flex-col gap-y-1.5">
                <p className="text-5xl text-gray-700 font-medium">Last name:</p>
                <p className="text-4xl text-gray-700 font-normal">Chen</p>
              </div>{" "}
            </div>
            <div className="flex-col">
              {" "}
              <div className="flex flex-col gap-y-1.5">
                <p className="text-5xl text-gray-700 font-medium">
                  School name:
                </p>
                <p className="text-4xl text-gray-700 font-normal">
                  Bayview SS.
                </p>
              </div>{" "}
            </div>
          </div>
        </div>
        <div className="flex-row">
          {" "}
          <div className="flex flex-row gap-x-16">
            <Button variant="default" className="pt-10 pb-10">
              Edit
            </Button>
            <Button variant="destructive" className="pt-10 pb-10">
              Delete
            </Button>
          </div>{" "}
        </div>
      </div>{" "}
    </div>
  );
}
