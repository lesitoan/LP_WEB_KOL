'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { useLoginMutation } from '@/services/api/authApi'
import { writeAuthSession } from '@/lib/authSession'
import { useAuthSession } from '@/hooks/useAuthSession'

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .max(64, 'Mật khẩu tối đa 64 ký tự'),
})

export type LoginFormValues = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [login, { isLoading }] = useLoginMutation()
  const { accessToken, hydrated } = useAuthSession()
  const hasSubmittedLogin = useRef(false)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  })

  const onSubmit = async (values: LoginFormValues) => {
    hasSubmittedLogin.current = true
    try {
      const result = await login(values).unwrap()
      writeAuthSession(result)
      const redirect = searchParams.get('redirect') || '/dashboard'
      router.push(redirect)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Đăng nhập thất bại',
        description: extractApiErrorMessage(error, 'Email hoặc mật khẩu không đúng, vui lòng thử lại.'),
      })
    }
  }

  useEffect(() => {
    if (hydrated && accessToken && !hasSubmittedLogin.current) {
      router.replace('/dashboard')
    }
  }, [accessToken, hydrated, router])

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.12),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(15,23,42,0.45),_transparent_55%)]">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border-strong bg-surface-1/95 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-md">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">Đăng nhập</CardTitle>
            <p className="text-sm text-muted-foreground">Tiếp tục với tài khoản email của bạn</p>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email" className="text-foreground">
                        Email
                      </Label>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="bg-surface-0/80 placeholder:text-muted-foreground/80"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password" className="text-foreground">
                        Mật khẩu
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="********"
                            className="bg-surface-0/80 placeholder:text-muted-foreground/80 pr-20"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting || isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
