"use client";
import React, { type MouseEvent } from "react";
import { PlusCircle, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/utils/uploadthing";

const LibraryHeader = ({
  name,
  description,
}: {
  name: string | undefined;
  description: string | undefined | null;
}) => {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log("Clicked!");
  }
  return (
    <div className="space-y-3 border border-b-stone-600">
      <h1 className="text-4xl font-bold tracking-wide text-neutral-800">
        {name}
      </h1>
      <p className="text-lg text-neutral-500">{description}</p>
      <div className="mb-6 flex space-x-3">
        <Dialog>
          <DialogTrigger className="flex items-center gap-2 rounded-xl bg-stone-300 px-4 py-2 font-semibold text-stone-500 hover:cursor-pointer">
            <p>Add book</p>
            <PlusCircle size={15} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item to {name}</DialogTitle>
              <DialogDescription>
                At the moment you can upload .pdf files directly or paste url of
                the pdf which has no login required.
              </DialogDescription>
            </DialogHeader>
            <form className="mx-3 grid grid-cols-4 space-x-3 border border-x-0 border-t-0 border-b-stone-500 pb-4">
              <input
                type="text"
                className="col-span-3 rounded-lg border border-stone-300 pl-4 focus:border-stone-400 focus:ring-0 focus:outline-none"
                placeholder="https://arxiv.org/pdf/2510.08564"
              />
              <button className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white">
                Add link
              </button>
            </form>
            <UploadDropzone
              appearance={{
                button: "ut-ready:bg-green-600 text-white font-semibold",
              }}
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </DialogContent>
        </Dialog>
        {/* <button
          onClick={(e) => {
            handleClick(e);
          }}
          className="flex items-center gap-2 rounded-xl bg-stone-300 px-4 py-2 font-semibold text-stone-500 hover:cursor-pointer"
        >
          <p>Add book</p>
          <PlusCircle size={15} />
        </button> */}
        <button className="flex items-center gap-2 rounded-xl bg-stone-300 px-4 py-2 font-semibold text-stone-500 hover:cursor-pointer">
          <p>Edit</p>
          <Pencil size={15} />
        </button>
      </div>
    </div>
  );
};

export default LibraryHeader;
