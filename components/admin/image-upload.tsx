"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, Loader2, ImageIcon, AlertCircle, CheckCircle } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  label?: string
  bucket?: string
}

export function ImageUpload({ value, onChange, onError, label = "Image", bucket = "blog-images" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleError = (errMsg: string) => {
    setError(errMsg)
    onError?.(errMsg)
  }

  const clearError = () => {
    setError(null)
    setUploadSuccess(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      handleError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      handleError("File size must be less than 5MB")
      return
    }

    setIsUploading(true)
    clearError()

    try {
      const supabase = createClient()

      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        // Check if bucket doesn't exist
        if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("bucket")) {
          throw new Error(`Storage bucket "${bucket}" not found. Please run the storage setup SQL script first.`)
        }
        throw uploadError
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path)

      onChange(publicUrl)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 2000)
    } catch (err) {
      console.error("Upload error:", err)
      handleError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    onChange("")
    clearError()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      {value ? (
        <div className="relative group">
          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-border">
            <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
            {uploadSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm text-destructive">
                <p>{error}</p>
                {error.includes("storage setup") && (
                  <p className="mt-1 text-xs opacity-80">
                    Run the SQL script:{" "}
                    <code className="bg-destructive/20 px-1 rounded">009-setup-storage-buckets.sql</code>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
