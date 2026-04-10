"use client";

import { useForm } from "react-hook-form";
import { Shield } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại."),
    newPassword: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự."),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp.",
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

type ChangePasswordCardProps = {
  onSubmit: (values: ChangePasswordFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function ChangePasswordCard({ onSubmit, isSubmitting }: ChangePasswordCardProps) {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Card className="self-start bg-surface-1 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-warning" />
          Đổi mật khẩu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <FormControl>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      className="bg-surface-0/80 placeholder:text-muted-foreground/80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <FormControl>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      className="bg-surface-0/80 placeholder:text-muted-foreground/80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      className="bg-surface-0/80 placeholder:text-muted-foreground/80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting || form.formState.isSubmitting}>
              Cập nhật mật khẩu
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
