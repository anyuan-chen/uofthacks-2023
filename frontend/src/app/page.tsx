import { Button } from "@/components/ui/button";
import Image from "next/image";
import { segoe } from "./layout";

export default function Home() {
  return (
    <div className="flex flex-col p-16 gap-8 h-full items-start">
      <h1 className={"text-3xl"}>welcome to andrew and james' time capsule!</h1>
      <div className={"flex flex-col gap-4 " + segoe.className}>
        <p>
          alternatively, this is also a demo of our figma to code plugin. every
          component that&apos;s on this website has been generated with our
          plugin.
          {"\n"}
          to get started, download our <a href="">figma plugin</a>, and set it
          up according to the instructions <a>we provide</a>.
        </p>
        <p>alternatively, to explore our journey, enter here:</p>
      </div>
      <a href="/journey">
        <Button variant="default" className="pt-5 pb-5">
          enter here!
        </Button>
      </a>
    </div>
  );
}
