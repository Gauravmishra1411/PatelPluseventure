import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const sizes = {
  sm: { width: 200, height: 65, className: "h-12 w-auto" },
  md: { width: 300, height: 90, className: "h-20 w-auto" },
  lg: { width: 400, height: 120, className: "h-28 w-auto" },
  xl: { width: 600, height: 240, className: "h-44 sm:h-56 w-auto" },
} as const

type LogoSize = keyof typeof sizes

interface LogoProps {
  size?: LogoSize
  href?: string
  linked?: boolean
  className?: string
  priority?: boolean
}

export function Logo({ size = "md", href = "/", linked = true, className, priority = false }: LogoProps) {
  const config = sizes[size]

  const image = (
    <Image
      src="/logo-ppv.png"
      alt="Patel Pulse Ventures"
      width={config.width}
      height={config.height}
      className={cn(config.className, "object-contain", className)}
      priority={priority}
    />
  )

  if (linked) {
    return (
      <Link href={href} className="flex items-center">
        {image}
      </Link>
    )
  }

  return <div className="flex items-center">{image}</div>
}
export default Logo;
