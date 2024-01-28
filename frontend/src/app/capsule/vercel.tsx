"use client";
import React from "react";
import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button";
import { Themes } from "../journey/layout";

interface VercelProps {
  children: any;
  index: number;
  setIndex: any;
  max: number;
}

const VercelLayoutCapsule = ({
  children,
  index,
  setIndex,
  max,
}: VercelProps) => {
  return (
    <div className="border border-black">
      <Rnd default={{ x: 0, y: 0, width: 640, height: 600 }}>
        <div className="w-full flex flex-col items-center justify-center rounded-lg ">
          <div className="flex flex-col rounded-lg pb-4 bg-[#E9E8E3]  w-full h-full">
            <div className="py-2 px-4 rounded-t-lg">
              <div className="flex space-x-2 ">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#EC6B62",
                  }}
                ></div>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#F5C05C",
                  }}
                ></div>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#5BC75E",
                  }}
                ></div>
              </div>
            </div>
            <hr style={{ color: "#E8EAED" }}></hr>
            <div className="p-8">{children}</div>
          </div>
        </div>
      </Rnd>
      <Button
        className="absolute bottom-2 left-2"
        variant="default"
        disabled={index == 0}
        onClick={() => {
          setIndex(index - 1);
        }}
      >
        back
      </Button>
      <Button
        className="absolute bottom-2 right-2"
        variant="default"
        disabled={index == max}
        onClick={() => {
          setIndex(index + 1);
        }}
      >
        forward
      </Button>
    </div>
  );
};

export default VercelLayoutCapsule;
