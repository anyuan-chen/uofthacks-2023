"use client";
import React from "react";
import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button";
import { Themes } from "../journey/layout";
import SpecialButton from "../blissbackground/windowsicons";

interface XPLayoutProps {
  children: any;
  index: number;
  setIndex: any;
  max: number;
}

const XPLayoutCapsule = ({ children, index, setIndex, max }: XPLayoutProps) => {
  return (
    <div
      style={{
        background: "url('/bliss.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "start",
        border: "5px",
      }}
    >
      <Rnd default={{ x: 0, y: 0, width: 640, height: 600 }}>
        <div
          className="bg-[#EFEDDF]"
          style={{
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "7px",
            boxShadow:
              "inset -1px -1px #00138c, inset 1px 1px #0831d9, inset -2px -2px #001ea0, inset 2px 2px #166aee, inset -3px -3px #003bda, inset 3px 3px #0855dd",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(180deg,#0997ff,#0053ee 8%,#0050ee 40%,#06f 88%,#06f 93%,#005bff 95%,#003dd7 96%,#003dd7)",
              height: "26px",
              width: "100%",
              padding: "3px 5px 3px 3px",
              borderTop: "1px solid #0831d9",
              borderLeft: "1px solid #0831d9",
              borderRight: "1px solid #001ea0",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "7px",
              fontSize: "13px",
              textShadow: "1px 1px #0f1089",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Your New Cool Component
            <div>
              <SpecialButton variant="minimize"></SpecialButton>
              <SpecialButton variant="maximize"></SpecialButton>
              <SpecialButton variant="close"></SpecialButton>
            </div>
          </div>
          <div className="p-8">{children}</div>
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

export default XPLayoutCapsule;
