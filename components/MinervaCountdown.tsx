'use client'

import {useEffect, useState} from 'react'

type MinervaCountdownProps = {
  targetDate: string
  isPresent: boolean
}

type RemainingTime = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateRemaining(targetDate: string): RemainingTime {
  const target = new Date(targetDate).getTime()
  const now = Date.now()

  const difference = Math.max(0, target - now)

  return {
    days: Math.floor(
      difference / (1000 * 60 * 60 * 24),
    ),

    hours: Math.floor(
      (difference / (1000 * 60 * 60)) % 24,
    ),

    minutes: Math.floor(
      (difference / (1000 * 60)) % 60,
    ),

    seconds: Math.floor(
      (difference / 1000) % 60,
    ),
  }
}

function formatLocalDate(targetDate: string) {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(targetDate))
}

export default function MinervaCountdown({
  targetDate,
  isPresent,
}: MinervaCountdownProps) {
  const [remaining, setRemaining] =
    useState<RemainingTime | null>(null)

  const [localDate, setLocalDate] =
    useState<string | null>(null)

  useEffect(() => {
    setLocalDate(formatLocalDate(targetDate))

    function updateCountdown() {
      const newRemaining =
        calculateRemaining(targetDate)

      setRemaining(newRemaining)

      const finished =
        newRemaining.days === 0 &&
        newRemaining.hours === 0 &&
        newRemaining.minutes === 0 &&
        newRemaining.seconds === 0

      if (finished) {
        window.location.reload()
      }
    }

    updateCountdown()

    const interval = window.setInterval(
      updateCountdown,
      1000,
    )

    return () => {
      window.clearInterval(interval)
    }
  }, [targetDate])

  return (
    <div className="mt-8">
      {/* CONTADOR */}
      <div className="text-xs font-black uppercase tracking-[0.15em] text-accent md:text-sm">
        {isPresent ? 'Se marcha en' : 'Llega en'}
      </div>

      {remaining && (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <TimeValue
            value={remaining.days}
            label="d"
          />

          <Separator />

          <TimeValue
            value={remaining.hours}
            label="h"
          />

          <Separator />

          <TimeValue
            value={remaining.minutes}
            label="min"
          />

          <Separator />

          <TimeValue
            value={remaining.seconds}
            label="s"
          />
        </div>
      )}

      {/* FECHA EN HORA LOCAL */}
      {localDate && (
        <div className="mt-4 text-sm font-medium text-text-secondary">
          {isPresent ? 'Hasta' : 'Llega'}{' '}
          <span className="text-white">
            {localDate}
          </span>
        </div>
      )}
    </div>
  )
}

function TimeValue({
  value,
  label,
}: {
  value: number
  label: string
}) {
  return (
    <span className="whitespace-nowrap">
      <span className="text-3xl font-black tabular-nums text-white md:text-4xl">
        {value}
      </span>

      <span className="ml-1 text-base font-bold text-text-secondary md:text-lg">
        {label}
      </span>
    </span>
  )
}

function Separator() {
  return (
    <span className="text-lg font-bold text-text-secondary">
      ·
    </span>
  )
}