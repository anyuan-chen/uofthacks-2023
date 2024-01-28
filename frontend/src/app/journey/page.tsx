"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useState } from "react";
import { ThemeContext, Themes } from "./layout";
import { inter, segoe, trebuchet } from "../layout";

const Page = () => {
  const theme = useContext(ThemeContext);

  const win7 = `
    p {
    }
  `;

  const xp = `
    p {

    }
  `;

  const vercel = `
    p { 
    }
  `;

  const css =
    theme === Themes.win7 ? win7 : theme === Themes.winXP ? xp : vercel;

  return (
    <>
      <div className="flex-col">
        <div className="flex flex-col gap-y-44">
          <div className="flex flex-col gap-y-10">
            <div className="flex-col">
              {" "}
              <div className="flex flex-col gap-y-5">
                <p className="text-4xl text-gray-700 font-normal">First name</p>
                <Button variant="default" className="pt-7 pb-5">
                  eg.{" "}
                </Button>
              </div>{" "}
            </div>
            <div className="flex-col">
              {" "}
              <div className="flex flex-col gap-y-2">
                <p className="text-4xl text-gray-700 font-normal">Last name:</p>
                <Button variant="default" className="pt-6 pb-6">
                  Chen
                </Button>
              </div>{" "}
            </div>
            <div className="flex-col">
              {" "}
              <div className="flex flex-col gap-y-3.5">
                <p className="text-4xl text-gray-700 font-normal">
                  School name:
                </p>
                <Button variant="default" className="pt-5 pb-5">
                  Chen
                </Button>
              </div>{" "}
            </div>
          </div>
          <div className="flex-row">
            {" "}
            <div className="flex flex-row gap-x-10">
              <Button variant="default" className="pt-10 pb-10">
                Save
              </Button>
              <Button variant="default" className="pt-10 pb-10">
                Cancel
              </Button>
            </div>{" "}
          </div>
        </div>{" "}
      </div>
      <style jsx>{css}</style>
    </>
  );
};

export default Page;
