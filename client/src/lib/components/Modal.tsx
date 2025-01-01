import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React from "react";

export type ModalProps = {
  isOpen: boolean;
  setIsClosed: (isOpen: boolean) => void;
  children: React.ReactNode;
  width?: string;
  title?: string;
};

const Modal = React.forwardRef<HTMLDialogElement, ModalProps>(
  ({ isOpen, title, setIsClosed, width = "", children }, ref) => {
    return (
      <Dialog
        open={isOpen}
        onClose={() => setIsClosed(false)}
        className="relative z-50 rounded-md"
        ref={ref}
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div
          className="fixed inset-0 bg-black/30"
          aria-hidden="true"
          onClick={() => setIsClosed(false)}
        />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <DialogPanel className={` bg-white p-3 min-w-72 min-h-72 ${width}`}>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <div className="mt-10">{children}</div>
            {/* ... */}
          </DialogPanel>
        </div>
      </Dialog>
    );
  }
);

export default Modal;
