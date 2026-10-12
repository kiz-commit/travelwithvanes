import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-3 focus-visible:ring-mar/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-lg bg-floresta text-white shadow-none hover:bg-mata",
        primary:
          "rounded-lg bg-maracuja text-ink shadow-none hover:bg-[#ffd04d] focus-visible:ring-ink/30",
        creator:
          "rounded-lg bg-mata text-white shadow-none hover:bg-floresta",
        "creator-outline":
          "rounded-lg border border-ink/20 bg-transparent text-ink shadow-none hover:border-ink/50 hover:bg-mist",
        sharp:
          "rounded-none bg-espresso text-linen font-bold tracking-wide shadow-none hover:bg-clay",
        outline:
          "rounded-full border-ink/12 bg-paper text-ink hover:bg-linen hover:text-ink dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "rounded-lg font-medium text-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        "ghost-light":
          "rounded-full font-semibold text-white hover:bg-white/10 hover:text-white",
        light:
          "rounded-lg bg-white text-ink shadow-none hover:bg-mist",
        "outline-light":
          "rounded-lg border border-white/40 bg-transparent text-white shadow-none hover:border-white hover:bg-white/10",
        destructive:
          "rounded-lg bg-destructive/10 font-medium text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "rounded-none text-cobalt underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs font-medium in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-lg px-4 text-[13px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 rounded-lg px-6 text-[14px] has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        cta: "h-12 gap-2.5 rounded-lg px-5 text-[15px] font-semibold sm:px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 sm:has-data-[icon=inline-end]:pr-5 sm:has-data-[icon=inline-start]:pl-5",
        icon: "size-10 rounded-full",
        "icon-xs":
          "size-7 rounded-lg in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...(render ? { render, nativeButton: false } : {})}
      {...props}
    />
  )
}

export { Button, buttonVariants }
