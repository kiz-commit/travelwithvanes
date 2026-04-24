"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  function insertLink() {
    if (!editor) return;
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }

  function insertImage() {
    if (!editor) return;
    const url = window.prompt("Enter image URL:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  const toolbarButtons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      label: "Heading 1",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      label: "Heading 2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      label: "Heading 3",
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      label: "Ordered List",
    },
    {
      icon: LinkIcon,
      action: insertLink,
      active: editor.isActive("link"),
      label: "Link",
    },
    {
      icon: ImageIcon,
      action: insertImage,
      active: false,
      label: "Image",
    },
  ];

  return (
    <div className="rounded-lg border border-input">
      <div className="flex flex-wrap gap-0.5 border-b p-1">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            title={btn.label}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              btn.active && "bg-muted text-foreground"
            )}
          >
            <btn.icon className="size-3.5" />
          </button>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm min-h-[120px] max-w-none px-3 py-2 text-sm focus-within:outline-none [&_.tiptap]:min-h-[100px] [&_.tiptap]:outline-none"
      />
    </div>
  );
}
