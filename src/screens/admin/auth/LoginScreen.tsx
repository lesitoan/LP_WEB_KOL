'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { SixDigitCodeInput } from '@/components/SixDigitCodeInput'
import { toast } from '@/hooks/useToast'
import { adminApi, extractApiErrorMessage } from '@/services/api/baseApi'
import { useAdminLoginMutation, useVerifyAdminTwoFactorLoginMutation } from '@/services/api/admin/authApi'
import { readAdminAuthSession, writeAdminAuthSession } from '@/lib/authSession'
import { canAccessAdminPath, getDefaultAdminPath } from '@/lib/adminPermissions'
import type { AdminLoginAttemptResponse, AdminTwoFactorChallenge } from '@/types/admin/auth'

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .max(64, 'Mật khẩu tối đa 64 ký tự'),
})

type LoginFormValues = z.infer<typeof schema>

const isTwoFactorChallenge = (value: AdminLoginAttemptResponse): value is AdminTwoFactorChallenge => {
  return 'requiresTwoFactor' in value && value.requiresTwoFactor === true
}

export default function AdminLoginScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [challenge, setChallenge] = useState<AdminTwoFactorChallenge | null>(null)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [twoFactorError, setTwoFactorError] = useState('')
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const [login, { isLoading }] = useAdminLoginMutation()
  const [verifyAdminTwoFactorLogin, { isLoading: isVerifyingTwoFactor }] = useVerifyAdminTwoFactorLoginMutation()
  const hasSubmittedLogin = useRef(false)
  const [hydrated, setHydrated] = useState(false)
  const [hasToken, setHasToken] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  })

  useEffect(() => {
    const session = readAdminAuthSession()
    setHasToken(Boolean(session.accessToken))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && hasToken && !hasSubmittedLogin.current) {
      const session = readAdminAuthSession()
      router.replace(getDefaultAdminPath(session.user?.role))
    }
  }, [hasToken, hydrated, router])

  const finishLogin = (result: Exclude<AdminLoginAttemptResponse, AdminTwoFactorChallenge>) => {
    writeAdminAuthSession(result)
    dispatch(adminApi.util.resetApiState())
    const requestedRedirect = searchParams.get('redirect')
    const redirect = requestedRedirect && canAccessAdminPath(result.user.role, requestedRedirect)
      ? requestedRedirect
      : getDefaultAdminPath(result.user.role)
    router.push(redirect)
  }

  const onSubmit = async (values: LoginFormValues) => {
    hasSubmittedLogin.current = true
    try {
      const result = await login(values).unwrap()
      if (isTwoFactorChallenge(result)) {
        setChallenge(result)
        setTwoFactorCode('')
        setTwoFactorError('')
        return
      }

      finishLogin(result)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Đăng nhập thất bại',
        description: extractApiErrorMessage(error, 'Email hoặc mật khẩu không đúng, vui lòng thử lại.'),
      })
    }
  }

  const onSubmitTwoFactor = async (code = twoFactorCode) => {
    if (!challenge) return
    const normalizedCode = code.replace(/\D/g, '').slice(0, 6)

    if (normalizedCode.length !== 6) {
      setTwoFactorError('Mã xác thực gồm 6 chữ số')
      return
    }

    try {
      const result = await verifyAdminTwoFactorLogin({
        challengeToken: challenge.challengeToken,
        code: normalizedCode,
      }).unwrap()

      if (isTwoFactorChallenge(result)) return

      finishLogin(result)
    } catch (error) {
      toast({
        variant: 'destructive',
                title: 'Xác minh 2 bước thất bại',
        description: extractApiErrorMessage(error, 'Mã xác thực không đúng hoặc phiên xác thực đã hết hạn.'),
      })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.12),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(15,23,42,0.45),_transparent_55%)]">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border-strong bg-surface-1/95 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-md">
          {!challenge ? (
            <>
              <CardHeader className="space-y-3 text-center">
                <CardTitle className="text-2xl font-semibold tracking-tight">Đăng nhập quản trị</CardTitle>
                <p className="text-sm text-muted-foreground">Tiếp tục với tài khoản admin của bạn</p>
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
                              placeholder="admin@example.com"
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
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isLoading}>
                      {isLoading ? 'Đang xử lý...' : 'Đăng nhập Admin'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </>
          ) : (
            <>
              <CardHeader className="space-y-3 text-center">
                <CardTitle className="text-2xl font-semibold tracking-tight">Xác minh 2 bước</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Nhập mã 6 số từ ứng dụng Authenticator để hoàn tất đăng nhập quản trị.
                </p>
              </CardHeader>
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  onSubmitTwoFactor()
                }}
                className="space-y-6"
              >
                  <CardContent className="space-y-4">
                    <SixDigitCodeInput
                      idPrefix="adminTwoFactorCode"
                      value={twoFactorCode}
                      onChange={(value) => {
                        setTwoFactorCode(value)
                        if (twoFactorError) setTwoFactorError('')
                      }}
                      disabled={isVerifyingTwoFactor}
                    />
                    {twoFactorError ? <p className="text-center text-xs text-red-400">{twoFactorError}</p> : null}
                  </CardContent>

                  <CardFooter className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isVerifyingTwoFactor}
                    >
                      {isVerifyingTwoFactor ? 'Đang xác thực...' : 'Xác thực'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setChallenge(null)
                        setTwoFactorCode('')
                        setTwoFactorError('')
                      }}
                    >
                      Đổi tài khoản
                    </Button>
                  </CardFooter>
                </form>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
