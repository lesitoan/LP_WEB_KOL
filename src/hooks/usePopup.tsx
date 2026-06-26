'use client'

import { useCallback, useMemo, useState, ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alertDialog'

type PopupMode = 'alert' | 'confirm'

type PopupPayload = {
  title: string
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

type PopupState = {
  open: boolean
  mode: PopupMode
  payload: PopupPayload
  resolver?: (accepted: boolean) => void
}

const DEFAULT_CONFIRM_TEXT = 'Đồng ý'
const DEFAULT_CANCEL_TEXT = 'Hủy'

const INITIAL_STATE: PopupState = {
  open: false,
  mode: 'alert',
  payload: { title: '' },
}

export function usePopup() {
  const [state, setState] = useState<PopupState>(INITIAL_STATE)

  const closePopup = useCallback((accepted: boolean) => {
    setState((current) => {
      current.resolver?.(accepted)
      return INITIAL_STATE
    })
  }, [])

  const showConfirm = useCallback((payload: PopupPayload) => {
    return new Promise<boolean>((resolve) => {
      setState({
        open: true,
        mode: 'confirm',
        payload,
        resolver: resolve,
      })
    })
  }, [])

  const showAlert = useCallback((payload: PopupPayload) => {
    return new Promise<void>((resolve) => {
      setState({
        open: true,
        mode: 'alert',
        payload,
        resolver: () => resolve(),
      })
    })
  }, [])

  const Popup = useMemo(() => {
    const confirmText = state.payload.confirmText || 'OK'
    const cancelText = state.payload.cancelText || DEFAULT_CANCEL_TEXT

    return function PopupRenderer() {
      return (
        <AlertDialog open={state.open} onOpenChange={(open) => !open && closePopup(false)}>
          <AlertDialogContent className="border-[#2A2A2A] bg-[#171717]">
            <AlertDialogHeader>
              <AlertDialogTitle>{state.payload.title}</AlertDialogTitle>
              {state.payload.description ? (
                <AlertDialogDescription>{state.payload.description}</AlertDialogDescription>
              ) : null}
            </AlertDialogHeader>
            <AlertDialogFooter>
              {state.mode === 'confirm' ? (
                <AlertDialogCancel onClick={() => closePopup(false)}>{cancelText}</AlertDialogCancel>
              ) : null}
              <AlertDialogAction
                onClick={() => closePopup(true)}
                className={state.payload.destructive ? 'bg-destructive text-white hover:bg-destructive/90' : ''}
              >
                {state.mode === 'confirm' ? state.payload.confirmText || DEFAULT_CONFIRM_TEXT : confirmText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }
  }, [closePopup, state])

  return {
    showConfirm,
    showAlert,
    Popup,
  }
}
