"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useState } from "react";
import { ThemeContext, Themes } from "./layout";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Page = () => {
  return (
    <>
      <div className="flex-col">
        {" "}
        <div className="flex flex-col gap-y-44">
          <div className="flex flex-col gap-y-12">
            <h1 className="text-5xl text-black font-bold">About Me</h1>
            <div className="flex flex-col gap-y-3.5">
              <div className="flex-row">
                {" "}
                <div className="flex flex-row gap-x-14">
                  <div className="flex-col">
                    {" "}
                    <div className="flex flex-col gap-y-2.5">
                      <p className="text-2xl text-gray-700 font-medium">
                        First name
                      </p>
                      <p className="text-lg text-gray-700 font-normal">
                        Andrew
                      </p>
                    </div>{" "}
                  </div>
                  <div className="flex-col">
                    {" "}
                    <div className="flex flex-col gap-y-3.5">
                      <p className="text-2xl text-gray-700 font-medium">
                        Last name:
                      </p>
                      <p className="text-lg text-gray-700 font-normal">Chen</p>
                    </div>{" "}
                  </div>
                </div>{" "}
              </div>
              <div className="flex-col">
                {" "}
                <div className="flex flex-col gap-y-1">
                  <p className="text-2xl text-gray-700 font-medium">
                    My favorite Hobby
                  </p>
                  <p className="text-lg text-gray-700 font-normal">
                    Love to play tft during class! (Oop sorry, I meant do actual
                    chemistry :p)
                  </p>
                </div>{" "}
              </div>
            </div>
          </div>
          <div className="flex-row">
            {" "}
            <div className="flex flex-row gap-x-36">
              <Button variant="destructive" className="pt-3.5 pb-3">
                Learn more
              </Button>
              <Button variant="destructive" className="pt-3.5 pb-3">
                Close
              </Button>
            </div>{" "}
          </div>
        </div>{" "}
      </div>
    </>
  );
};

export default Page;
