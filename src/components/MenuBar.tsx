"use client";

import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  List,
  Pilcrow,
  Strikethrough,
} from "lucide-react";
import React from "react";
import { Toggle } from "./ui/toggle";
import { BulletList } from "@tiptap/extension-list";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

Image.configure({
  inline: false,
  allowBase64: true, // IMPORTANT for local files
});

const addImage = (editor: Editor) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({ src: reader.result as string })
        .run();
    };

    reader.readAsDataURL(file);
  };

  input.click();
};

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group flex flex-wrap gap-0.5">
        <Toggle
          aria-label="Toggle Heading"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <Heading1 />
        </Toggle>
        <Toggle
          aria-label="Toggle Heading 2"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <Heading2 />
        </Toggle>
        <Toggle
          aria-label="Toggle Heading 3"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <Heading3 />
        </Toggle>
        <Toggle
          aria-label="Paragraph"
          size="sm"
          onClick={() => editor.chain().focus().setParagraph().run()}
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <Pilcrow />
        </Toggle>

        <Toggle
          aria-label="Bold"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <Bold />
        </Toggle>

        <Toggle
          aria-label="Italic"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <Italic />
        </Toggle>

        <Toggle
          aria-label="Strikethrough"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <Strikethrough />
        </Toggle>

        <Toggle
          aria-label="Highlight"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <Highlighter />
        </Toggle>

        <Toggle
          aria-label="Left"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <AlignLeft />
        </Toggle>

        <Toggle
          aria-label="Center"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <AlignCenter />
        </Toggle>

        <Toggle
          aria-label="Right"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <AlignRight />
        </Toggle>

        <Toggle
          aria-label="Justify"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <AlignJustify />
        </Toggle>
        <Toggle
          aria-label="Bulleted List"
          size="sm"
          onClick={() => editor.commands.toggleBulletList()}
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <List />
        </Toggle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor && addImage(editor)}
        >
          <ImageIcon />
        </Button>
      </div>
    </div>
  );
};
interface TiptapProps {
  content: string;
  onChange: (e: any) => void;
}
export default ({content, onChange}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    immediatelyRender: false,
    content: content || "<p>Write your announcement here...</p>",
    editorProps: {
        attributes: {
            class: "border-none"
        }
    },
    onUpdate: ({ editor }) => {
        onChange && onChange(editor.getHTML());
    },
  });

  return (
    <>
      <MenuBar editor={editor} />
      <div className="border rounded-sm h-auto min-h-[300px] p-1">
        <EditorContent editor={editor} className="border-none"/>
      </div>
    </>
  );
};
