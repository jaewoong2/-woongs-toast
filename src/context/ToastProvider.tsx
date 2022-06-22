import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { ToastMessage } from '../components/Block/ToastMessage'

type Props = {
  children?: React.ReactNode
}

type SubPosition = 'center' | 'left' | 'right'
type Position = 'top' | 'bottom'

type ToastActionType = {
  show: () => void
  hide: () => void | null
  setBorderRadius: (r: number) => void
  setMessage: (msg?: string) => void
  setBackgroundColor: (bg: string) => void
  setDuration: (ms?: number) => void
  setColor: (color: 'black' | 'white') => void
  setPosition: (position: Position) => void
  setSubPosition: (position: SubPosition) => void
  setClassName: (className: string) => void
  setDistance: (distance?: number) => void
  setWidth: (px?: number) => void
}

const initalToastAction = {} as ToastActionType

export const ToastActionContext = createContext({ ...initalToastAction })

const ToastProvider: React.FC<Props> = ({ children }) => {
  const [isShow, setIsShow] = useState(false)
  const [isHiding, setIsHiding] = useState(false)
  const [message, setMessage] = useState('')
  const [duration, setDuration] = useState(1000)
  const [backgroundColor, setBackgroundColor] = useState('#71a8ec')
  const [color, setColor] = useState<'white' | 'black'>('black')
  const [position, setPosition] = useState<Position>('bottom')
  const [subPosition, setSubPosition] = useState<SubPosition>('center')
  const [distance, setDistance] = useState(64)
  const [width, setWidth] = useState(400)
  const [className, setClassName] = useState('')
  const [borderRadius, setBorderRadius] = useState(8)

  const setShow = useCallback(() => {
    if (!isHiding) {
      setIsShow(true)
    }
  }, [isHiding])

  const setHide = () => {
    setIsShow(false)
    setIsHiding(false)
  }

  const handleMessage = (msg?: string) => {
    setMessage(msg ?? '')
  }

  useEffect(() => {
    if (isShow) {
      const hidingTimer = setTimeout(() => {
        setIsHiding(true)
      }, duration / 2)

      const hideTimer = setTimeout(() => {
        setHide()
      }, duration)

      return () => {
        clearTimeout(hidingTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [duration, isShow])

  const actions = useMemo(() => {
    return {
      show: setShow,
      hide: setHide,
      setMessage: handleMessage,
      setBorderRadius: (radius: number) => setBorderRadius(radius),
      setDuration: (ms?: number) => setDuration(ms ?? 2000),
      setPosition: (pos: Position) => setPosition(pos),
      setBackgroundColor: (c: string) => setBackgroundColor(c),
      setColor: (c: 'white' | 'black') => setColor(c),
      setSubPosition: (pos: SubPosition) => setSubPosition(pos),
      setDistance: (px?: number) => setDistance(px ?? 64),
      setWidth: (px?: number) => setWidth(px ?? 400),
      setClassName: (name: string) => setClassName(name),
    }
  }, [])

  return (
    <ToastActionContext.Provider value={actions}>
      {children}
      {isShow && (
        <ToastMessage
          color={color}
          borderRadius={borderRadius}
          backgroundColor={backgroundColor}
          subPosition={subPosition}
          width={width}
          distance={distance}
          position={position}
          duration={duration}
          hiding={isHiding}
          className={className}
        >
          {message}
        </ToastMessage>
      )}
    </ToastActionContext.Provider>
  )
}

export { ToastProvider }
