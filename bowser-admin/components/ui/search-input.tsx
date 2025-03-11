/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/xy6MpYtkczL
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/
import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import * as React from "react"


const SearchInpt = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="flex w-full max-w-sm items-center border rounded-lg px-2.5 py-1.5">
        <SearchIcon className="h-4 w-4 mr-2.5" />
        <Input {...props} className={cn("w-full border-0 focus:border-none")} />
      </div>
    )
  })

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export default SearchInpt