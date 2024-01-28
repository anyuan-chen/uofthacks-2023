"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { inter, msSans } from "@/app/layout";
import { ThemeContext, Themes } from "@/app/journey/layout";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#BFBFBF] font-pixelated text-black border hover:border-[#F3C971] " +
          msSans.className,
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const win7Styles = {
  backgroundImage: "linear-gradient(180deg,#eaf6fd 45%,#bee6fd 0,#a7d9f5)",
  borderColor: "#5586a3",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const theme = React.useContext(ThemeContext);

    const addButtonVariants = cva(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        variants: {
          variant: {
            default:
              theme === Themes.winXP
                ? "bg-[#BFBFBF] font-pixelated text-black border hover:border-[#F3C971] " +
                  msSans.className
                : theme === Themes.win7
                ? "bg-[#BFBFBF] font-pixelated text-black border hover:border-[#F3C971]" +
                  msSans.className
                : "font-sans bg-primary text-primary-foreground hover:bg-primary/90" +
                  inter.className,
            destructive:
              theme === Themes.winXP
                ? "bg-[#BFBFBF] font-pixelated text-black border hover:border-[#F3C971] " +
                  msSans.className
                : theme === Themes.win7
                ? "bg-[#BFBFBF] font-pixelated text-black border hover:border-[#F3C971]" +
                  msSans.className
                : "bg-destructive text-destructive-foreground hover:bg-destructive/90" +
                  inter.className,

            outline:
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary:
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
          },
          size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
          },
        },
        defaultVariants: {
          variant: "default",
          size: "default",
        },
      }
    );

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        style={theme === Themes.win7 ? win7Styles : {}}
        className={cn(addButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
