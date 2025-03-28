import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
  label?: string
  description?: string
  icon?: React.ReactNode
  onFilesSelected?: (files: FileList | null) => void
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, containerClassName, label, description, icon, onFilesSelected, ...props }, ref) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = React.useState<string>("")

    const handleClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        setFileName(files[0].name)
      } else {
        setFileName("")
      }
      
      if (onFilesSelected) {
        onFilesSelected(files)
      }
    }

    return (
      <div className={cn("relative", containerClassName)}>
        <div 
          onClick={handleClick}
          className={cn(
            "flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors",
            className
          )}
        >
          <div className="space-y-1 text-center">
            {icon || <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>}
            
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                <span>{label || "Upload a file"}</span>
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            
            {description && <p className="text-xs text-gray-500">{description}</p>}
            
            {fileName && (
              <p className="mt-2 text-sm text-gray-600 truncate max-w-full">
                {fileName}
              </p>
            )}
          </div>
        </div>
        
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          {...props}
        />
      </div>
    )
  }
)

FileInput.displayName = "FileInput"

export { FileInput }
