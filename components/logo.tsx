import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const sizes = {
  sm: { width: 210, height: 68, className: "h-[3.15rem] w-auto" },
  md: { width: 315, height: 95, className: "h-[5.25rem] w-auto" },
  lg: { width: 420, height: 126, className: "h-[7.35rem] w-auto" },
  xl: { width: 630, height: 252, className: "h-[11.55rem] sm:h-[14.7rem] w-auto" },
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
      src="/bg.png"
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
