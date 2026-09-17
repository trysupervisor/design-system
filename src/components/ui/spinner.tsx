import { cn } from "cn"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4", className)}
      {...props}
    >
      {Array.from({ length: 12 }, (_, index) => (
        <rect
          key={index}
          data-slot="spinner-segment"
          x="7.25"
          y="1"
          width="1.5"
          height="4"
          rx="0.75"
          fill="currentColor"
          transform={`rotate(${index * 30} 8 8)`}
          style={{ "--spinner-delay": `${index * -83.333}ms` } as React.CSSProperties}
        />
      ))}
    </svg>
  )
}

export { Spinner }
