"use client";
import React, { useState, type FormEvent } from "react";
import { PlusCircle, Pencil } from "lucide-react";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "react-toastify";

const LibraryHeader = ({
  name,
  description,
  id,
}: {
  name: string | undefined;
  description: string | undefined | null;
  id: string;
}) => {
  const utils = api.useUtils();
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  const createPaper = api.paper.create.useMutation({
    onSuccess: async () => {
      await utils.category.getCategoryInfoById.invalidate({ categoryId: id });
      await utils.category.getCategoryInfoById.refetch({ categoryId: id });

      toast.success("Successfully saved!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setOpen(false);
      setUrl("");
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url) return;
    createPaper.mutate({
      categoryId: id,
      url,
    });
  }

  return (
    <div>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-wide text-neutral-800">
          {name}
        </h1>
        <p className="text-lg text-neutral-500">{description}</p>
        <div className="flex space-x-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex items-center gap-2 rounded-xl bg-[#f3f4f6] px-4 py-2 font-semibold text-gray-800 transition-transform duration-200 hover:scale-105 hover:cursor-pointer hover:bg-[#e5e7eb]">
              <p>Add book</p>
              <PlusCircle size={15} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item to {name}</DialogTitle>
                <DialogDescription>
                  At the moment you can upload .pdf files directly or paste url
                  of the pdf which has no login required.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-4 space-x-3 border border-x-0 border-t-0 border-b-stone-500 pb-4"
              >
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="col-span-3 rounded-lg border border-stone-300 bg-stone-200 pl-4 focus:border-stone-400 focus:ring-0 focus:outline-none"
                  placeholder="https://arxiv.org/pdf/2510.08564"
                />
                <button
                  type="submit"
                  disabled={createPaper.isPending}
                  className={`cursor-pointer rounded-lg px-4 py-2 font-semibold text-white ${
                    createPaper.isPending ? "bg-gray-400" : "bg-green-600"
                  }`}
                >
                  {createPaper.isPending ? "Adding..." : "Add link"}
                </button>
              </form>
              <UploadDropzone
                className="bg-stone-200"
                appearance={{
                  button: "ut-ready:bg-green-600 text-white font-semibold",
                }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res[0]?.ufsUrl);
                  createPaper.mutate({
                    categoryId: id,
                    url: res[0]?.ufsUrl as string,
                  });
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </DialogContent>
          </Dialog>

          <button className="mb-0 flex items-center gap-2 rounded-xl bg-[#f3f4f6] px-4 py-2 font-semibold text-gray-800 transition-transform duration-200 hover:scale-105 hover:cursor-pointer hover:bg-[#e5e7eb]">
            <p>Edit</p>
            <Pencil size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryHeader;
