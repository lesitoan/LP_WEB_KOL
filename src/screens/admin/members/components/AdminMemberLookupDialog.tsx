'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useLazyGetAdminMemberByLpexUidQuery } from '@/services/api/admin/membersApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { formatLpexStatus, formatTelegramStatus, formatUsd, fullName } from '../mappers'

export function AdminMemberLookupDialog() {
  const [open, setOpen] = useState(false)
  const [lpexUid, setLpexUid] = useState('')
  const [lookupMember, lookupQuery] = useLazyGetAdminMemberByLpexUidQuery()

  const handleLookup = async () => {
    const uid = lpexUid.trim()
    if (!uid) return
    await lookupMember({ lpexUid: uid })
  }

  const member = lookupQuery.data

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button type="button" variant="outline">
          <Search className="h-4 w-4" />
          Tra cứu UID
        </Button> */}
      </DialogTrigger>
      <DialogContent className="max-w-xl w-[calc(100vw-1rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle>Tra cứu thành viên theo LPEX UID</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Field orientation="vertical">
            <FieldLabel>LPEX UID</FieldLabel>
            <div className="flex gap-2">
              <Input
                value={lpexUid}
                onChange={(event) => setLpexUid(event.target.value)}
                placeholder="Nhập LPEX UID"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    void handleLookup()
                  }
                }}
              />
              <Button type="button" onClick={handleLookup} disabled={lookupQuery.isFetching || !lpexUid.trim()}>
                Tìm
              </Button>
            </div>
            <FieldDescription>Endpoint: GET /admin/members/by-lpex-uid/:lpexUid</FieldDescription>
          </Field>

          {lookupQuery.error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/[0.08] p-3 text-sm text-destructive">
              {extractApiErrorMessage(lookupQuery.error, 'Không tìm thấy thành viên')}
            </div>
          ) : null}

          {member ? (
            <div className="rounded-lg border border-border bg-surface-2/40 p-4">
              <p className="font-semibold">{fullName(member.telegramFirstName, member.telegramLastName, member.telegramUsername)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                @{member.telegramUsername || '---'} · TG ID {member.telegramUserId}
              </p>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <span>LPEX: {formatLpexStatus(member.lpexUserStatus)}</span>
                <span>Telegram: {formatTelegramStatus(member.telegramStatus)}</span>
                <span>Volume: {formatUsd(member.usdVolume)}</span>
                <span>KOL: {member.referrerKol?.displayName ?? member.referrerKolCode ?? '---'}</span>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
