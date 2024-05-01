import { Link } from 'react-router-dom'
import { FloatingPortal, arrow, shift, useFloating, offset, Placement } from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ElementType, useId, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  //  as được dùng trong trường hợp mà người đùng muốn sử dụng thẻ kháC ngoài thẻ div
  as?: ElementType
  initalOpen?: boolean
  placement?: Placement
}

export default function Popover({
  children,
  className,
  renderPopover,
  as: Element = 'div',
  initalOpen,
  placement = 'bottom-end'
}: Props) {
  const [isOpen, setIsOpen] = useState(initalOpen || false)
  const id = useId()
  const arrowRef = useRef<HTMLElement>(null)

  const { x, y, refs, floatingStyles, strategy, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })],
    placement: placement
  })

  //  dùng để show đối tượng
  const showPopover = () => {
    setIsOpen(true)
  }

  const hidePopover = () => {
    setIsOpen(false)
  }
  return (
    <Element className={className} ref={refs.setReference} onMouseMove={showPopover} onMouseLeave={hidePopover}>
      {children}
      {/*  thằng này bắt buộc phải bao bộc bằng thằng Portal */}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                ...floatingStyles,
                transformOrigin: `${middlewareData.arrow?.x}px-top`
              }}
            >
              <span
                ref={arrowRef}
                className='border-x-transparent border-t-transparent border-b-white-500 border-[11px] absolute -translate-y-full'
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
