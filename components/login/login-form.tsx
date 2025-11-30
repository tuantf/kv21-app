'use client'

import { cn } from '@/libs/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NavLogo } from '@/components/sidebar/nav-logo'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'md:bg-sidebar/50 -mt-8 flex flex-col gap-6 rounded-lg p-6 md:border md:backdrop-blur-lg',
        className,
      )}
      {...props}
    >
      <form>
        <FieldGroup>
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <NavLogo />
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="email@kv21.io.vn" required />
          </Field>
          <Field>
            <Button
              type="submit"
              className="bg-signature-blue/80 hover:bg-signature-blue/90 text-white shadow-sm hover:text-white"
            >
              Đăng nhập
            </Button>
          </Field>
          <FieldSeparator className="text-muted-foreground font-medium">Hoặc</FieldSeparator>
          <Field>
            <Button variant="outline" type="button" className="w-full gap-3">
              <img src="/logo/google.svg" alt="Google" width={16} height={16} />
              <div className="text-muted-foreground">Đăng nhập với Google</div>
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
