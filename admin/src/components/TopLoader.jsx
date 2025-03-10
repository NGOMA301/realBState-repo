"use client"

import { useEffect, useState } from "react"

export function TopLoader({ isLoading }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval

    if (isLoading) {
      setProgress(10)

      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(interval)
            return prevProgress
          }
          return prevProgress + (90 - prevProgress) * 0.1
        })
      }, 200)
    } else {
      setProgress((prevProgress) => {
        if (prevProgress > 0) {
          return 100
        }
        return 0
      })
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLoading])

  useEffect(() => {
    let timeout

    if (progress === 100) {
      timeout = setTimeout(() => {
        setProgress(0)
      }, 500)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [progress])

  if (progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
    </div>
  )
}

