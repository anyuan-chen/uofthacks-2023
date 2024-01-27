import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex-col py-80">
      {" "}
      <p className="text-7xl text-gray-700 font-bold">Your Info</p>
      <div className="flex-col justify-start gap0 py-20">
        {" "}
        <p className="text-5xl text-gray-700 font-medium">Last name:</p>
        <p className="text-4xl text-gray-700 font-normal">Chen</p>{" "}
      </div>
      <div className="flex-col justify-start gap-1.5 py-2.5">
        {" "}
        <p className="text-5xl text-gray-700 font-medium">School name:</p>
        <p className="text-4xl text-gray-700 font-normal">Bayview SS.</p>{" "}
      </div>
      <div className="flex-row justify-start gap-16 px0">
        {" "}
        <Button variant="default" className="pt-10 pb-10">
          Delete
        </Button>
        <Button variant="default" className="pt-10 pb-10">
          Edit
        </Button>{" "}
      </div>
      <div className="flex-col justify-center gap0 py-20">
        {" "}
        <p className="text-5xl text-gray-700 font-medium">First name</p>
        <p className="text-4xl text-gray-700 font-normal">Andrew</p>{" "}
      </div>{" "}
    </div>
  );
}
