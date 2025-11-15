"use client";

import {
  useState,
  type MouseEventHandler,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useSession } from "next-auth/react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  RemoveFormatting,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CodeSquare,
  Quote,
  Minus,
  Undo,
  Redo,
  ImageIcon,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";

type TiptapContent = Record<string, unknown>;

interface NotesProps {
  serverNotes: unknown;
  uuid: string;
}

export default function Notes({ serverNotes, uuid }: NotesProps) {
  const [notes, setNotes] = useState<TiptapContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();

  const parsedServerNotes = useMemo(() => {
    if (!serverNotes) return null;
    if (typeof serverNotes === "string") {
      try {
        return JSON.parse(serverNotes) as TiptapContent;
      } catch {
        console.error("Failed to parse server notes");
        return null;
      }
    }
    return serverNotes as TiptapContent;
  }, [serverNotes]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
    ],
    content: parsedServerNotes,
    immediatelyRender: false,
    onUpdate({ editor }) {
      setNotes(editor.getJSON() as TiptapContent);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl h-full w-full focus:outline-none flex-grow min-h-full dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
        style: "min-height: 100%;",
      },
    },
  });

  useEffect(() => {
    if (editor && parsedServerNotes) {
      editor.commands.setContent(parsedServerNotes); // <-- Updates editor when serverNotes changes
    }
  }, [serverNotes, editor]); // <-- Re-runs when serverNotes prop changes

  useEffect(() => {
    setIsClient(true);
  }, []);

  const upsertNoteMutation = api.paper.upsertNote.useMutation();

  const saveNotes = useCallback(async () => {
    if (saving || !editor) return;

    setSaving(true);
    try {
      const content = editor.getJSON();
      if (!isValidTiptapContent(content)) {
        toast.error("Invalid note content");
        setSaving(false);
        return;
      }

      await upsertNoteMutation.mutateAsync({
        paperId: uuid,
        content,
      });
      toast.success("Notes saved successfully");
    } catch (err) {
      console.error(" Error saving notes:", err);
      toast.error("Couldn't save notes");
    } finally {
      setSaving(false);
    }
  }, [editor, uuid, saving, upsertNoteMutation]);

  const notesContainerRef = useRef<HTMLDivElement>(null);
  const [isNotesFocused, setIsNotesFocused] = useState(false);

  // Track focus state of the notes section
  useEffect(() => {
    const checkFocus = () => {
      if (!notesContainerRef.current) return;

      const editorHasFocus = editor?.isFocused;
      const containerHasFocus = notesContainerRef.current.contains(
        document.activeElement,
      );

      setIsNotesFocused(editorHasFocus || containerHasFocus);
    };

    document.addEventListener("focusin", checkFocus);
    document.addEventListener("focusout", checkFocus);
    document.addEventListener("click", checkFocus);

    return () => {
      document.removeEventListener("focusin", checkFocus);
      document.removeEventListener("focusout", checkFocus);
      document.removeEventListener("click", checkFocus);
    };
  }, [editor]);

  // Add keyboard shortcut for Ctrl+S to save notes only when notes section is focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNotesFocused && (e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveNotes();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveNotes, isNotesFocused]);

  if (!isClient || !editor) {
    return (
      <div className="text-editor unreset flex h-screen w-full flex-col gap-2 border-2 p-2">
        <div className="bg-muted h-10 animate-pulse rounded" />
        <div className="bg-muted flex-grow animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div
      ref={notesContainerRef}
      className="text-editor unreset flex h-screen w-full flex-col gap-2 border-2 p-2"
    >
      <MenuBar editor={editor} saveNotesFunc={saveNotes} saving={saving} />
      <div className="flex flex-grow flex-col overflow-hidden">
        <EditorContent
          editor={editor}
          className="flex min-h-full flex-grow flex-col overflow-y-auto"
          onClick={() => editor?.commands.focus()}
        />
      </div>
    </div>
  );
}

type MenuBarProps = {
  editor: Editor;
  saveNotesFunc: MouseEventHandler<HTMLButtonElement>;
  saving: boolean;
};

function MenuBar({ editor, saveNotesFunc, saving }: MenuBarProps) {
  return (
    <div className="flex flex-row flex-wrap gap-3 border-b-2 pb-3">
      <button
        onClick={() => {
          const result = editor.chain().focus().toggleBold().run();
          console.log(" Bold command result:", result);
        }}
        className={
          editor.isActive("bold")
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Bold"
        aria-label="Toggle bold"
      >
        <Bold size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Italic"
        aria-label="Toggle italic"
      >
        <Italic size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Strikethrough"
        aria-label="Toggle strikethrough"
      >
        <Strikethrough size={20} />
      </button>
      <button
        onClick={() => {
          const result = editor
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run();
          console.log(
            " H1 command result:",
            result,
            "Editor state:",
            editor.isActive("heading", { level: 1 }),
          );
        }}
        className={
          editor.isActive("heading", { level: 1 })
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Heading 1"
        aria-label="Toggle heading 1"
      >
        <Heading1 size={20} />
      </button>
      <button
        onClick={() => {
          const result = editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run();
          console.log(" H2 command result:", result);
        }}
        className={
          editor.isActive("heading", { level: 2 })
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Heading 2"
        aria-label="Toggle heading 2"
      >
        <Heading2 size={20} />
      </button>
      <button
        onClick={() => {
          const result = editor
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run();
          console.log(" H3 command result:", result);
        }}
        className={
          editor.isActive("heading", { level: 3 })
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Heading 3"
        aria-label="Toggle heading 3"
      >
        <Heading3 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={
          editor.isActive("code")
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Inline Code"
        aria-label="Toggle inline code"
      >
        <Code size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={
          editor.isActive("codeBlock")
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Code Block"
        aria-label="Toggle code block"
      >
        <CodeSquare size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          editor.isActive("paragraph")
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Paragraph"
        aria-label="Set paragraph"
      >
        <Pilcrow size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Bullet List"
        aria-label="Toggle bullet list"
      >
        <List size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Ordered List"
        aria-label="Toggle ordered list"
      >
        <ListOrdered size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote")
            ? "active-menu-item menu-item cursor-pointer"
            : "non-active-menu-item menu-item cursor-pointer"
        }
        title="Blockquote"
        aria-label="Toggle blockquote"
      >
        <Quote size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
        className="menu-item cursor-pointer"
        aria-label="Insert horizontal rule"
      >
        <Minus size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo"
        className="menu-item cursor-pointer"
        aria-label="Undo"
      >
        <Undo size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo"
        className="menu-item cursor-pointer"
        aria-label="Redo"
      >
        <Redo size={20} />
      </button>
      <button
        onClick={() => {
          const url = window.prompt("Enter the URL of the image:");
          if (url && isValidImageUrl(url)) {
            editor.chain().focus().setImage({ src: url }).run();
          } else if (url) {
            toast.error("Invalid image URL. Must be HTTPS.");
          }
        }}
        title="Insert Image"
        className="menu-item cursor-pointer"
        aria-label="Insert image"
      >
        <ImageIcon size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title="Remove Formatting"
        className="menu-item cursor-pointer"
        aria-label="Remove formatting"
      >
        <RemoveFormatting size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().clearNodes().run()}
        title="Clear Nodes"
        className="menu-item cursor-pointer"
        aria-label="Clear nodes"
      >
        <X size={20} />
      </button>
      <button
        disabled={saving}
        onClick={saveNotesFunc}
        title="Save"
        className="menu-item cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Save notes"
      >
        <Save size={20} />
      </button>
    </div>
  );
}

function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol !== "https:") {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function isValidTiptapContent(content: unknown): boolean {
  if (!content || typeof content !== "object") {
    return false;
  }

  const obj = content as Record<string, unknown>;

  if (typeof obj.type !== "string") {
    return false;
  }

  const contentString = JSON.stringify(content);
  if (contentString.length > 1000000) {
    return false;
  }

  return true;
}
