import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-linear-to-r from-rose-100 to-pink-100", className)}
      {...props}
    />
  )
}

export { Skeleton }
