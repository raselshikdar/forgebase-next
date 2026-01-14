"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Loader2,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  bucket?: string
}

export function RichTextEditor({ value, onChange, label, placeholder, bucket = "blog-images" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`

      const { data, error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path)

      // Insert image at cursor position
      execCommand("insertImage", publicUrl)
    } catch (err) {
      console.error("Upload error:", err)
      alert(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const insertLink = () => {
    const url = prompt("Enter link URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const toolbarButtons = [
    { icon: Bold, command: "bold", tooltip: "Bold" },
    { icon: Italic, command: "italic", tooltip: "Italic" },
    { icon: Underline, command: "underline", tooltip: "Underline" },
    { icon: Heading1, command: "formatBlock", value: "h1", tooltip: "Heading 1" },
    { icon: Heading2, command: "formatBlock", value: "h2", tooltip: "Heading 2" },
    { icon: Heading3, command: "formatBlock", value: "h3", tooltip: "Heading 3" },
    { icon: List, command: "insertUnorderedList", tooltip: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", tooltip: "Numbered List" },
    { icon: Quote, command: "formatBlock", value: "blockquote", tooltip: "Quote" },
    { icon: Code, command: "formatBlock", value: "pre", tooltip: "Code Block" },
    { icon: AlignLeft, command: "justifyLeft", tooltip: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", tooltip: "Align Center" },
    { icon: AlignRight, command: "justifyRight", tooltip: "Align Right" },
  ]

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div
        className={`border rounded-lg overflow-hidden transition-colors ${
          isFocused ? "border-ring ring-2 ring-ring/20" : "border-input"
        }`}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-muted/30 border-b">
          {toolbarButtons.map((btn) => {
            const Icon = btn.icon
            return (
              <Button
                key={btn.command + (btn.value || "")}
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => execCommand(btn.command, btn.value)}
                title={btn.tooltip}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}
          <div className="w-px h-8 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={insertLink}
            title="Insert Link"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          className="prose prose-sm max-w-none min-h-[400px] p-4 focus:outline-none dark:prose-invert"
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-placeholder={placeholder}
          style={{
            whiteSpace: "pre-wrap",
          }}
        />
      </div>
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 8px 0;
        }
      `}</style>
    </div>
  )
}
