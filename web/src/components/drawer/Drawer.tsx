import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { isClient } from "@/helpers";

export type ContentProps = React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
  size?: string | number;
};

const Content = React.forwardRef<HTMLDivElement, ContentProps>(function (
  { style, ...props },
  ref
) {
  const screenBasedWidth = (width: number) => {
    if (width >= 1024) return "40%";
    if (width > 425) return "60%";
    return "100%";
  };
  const sizeChecker = (size: ContentProps["size"]) => {
    if (typeof size === "string" && !size.includes("%")) {
      const parsedSize = parseInt(size, 10);
      return isNaN(parsedSize) ? size : `${parsedSize}px`;
    }
    return size || isClient() ? screenBasedWidth(window.screen.width) : "100%";
  };

  return (
    <>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-20"></Dialog.Overlay>
        <Dialog.Content
          ref={ref}
          asChild
          style={{
            width: sizeChecker(props.size),
          }}
        >
          <div className="border-solid bg-white overflow-auto fixed top-0 right-0">
            {props.children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </>
  );
});
Content.displayName = "Content";

export const Drawer = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
  Content: Content,
};

export default Drawer;
