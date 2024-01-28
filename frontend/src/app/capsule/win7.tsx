"use client";
import React from "react";
import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button";
import { Themes } from "../journey/layout";
import { segoe } from "../layout";

interface Win7LayoutProps {
  children: any;
  index: number;
  setIndex: any;
  max: number;
}

const Win7LayoutCapsule = ({
  children,
  index,
  setIndex,
  max,
}: Win7LayoutProps) => {
  return (
    <div
      style={{
        background: "url('/win7.jpeg') no-repeat center center fixed",
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
          style={{
            boxShadow: "2px 2px 10px 1px rgba(0,0,0,.7), inset 0 0 0 1px #fffa",
            background:
              "linear-gradient(90deg,#ffffff66,#0000001a,#ffffff33),#4580c4",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <div
            style={{
              alignItems: "center",
              background:
                "linear-gradient(90deg,#ffffff66,#0000001a,#ffffff33),#4580c4",
              border: "1px solid rgba(0,0,0,.7)",
              borderRadius: "6px 6px 0 0",
              boxShadow: "inset 0 0 0 1px #fff9",
              display: "flex",
              justifyContent: "space-between",
              padding: "6px",
            }}
          >
            <h1
              style={{
                color: "#000",
                letterSpacing: "0",
                lineHeight: "15px",
                textShadow:
                  "0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff",
                padding: "6px",
                fontWeight: "lighter",
              }}
              className={segoe.className}
            >
              Control Panel
            </h1>
          </div>
          <div
            style={{
              background: "#f0f0f0",
              border: "1px solid rgba(0,0,0,.7)",
              boxShadow: "0 0 0 1px #fff9",
              margin: "0 6px 6px",
              padding: "6px",
            }}
          >
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
      <style jsx>{`
        p {
        }
      `}</style>
    </div>
  );
};

export default Win7LayoutCapsule;
