'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion, useDragControls, useMotionValue, useScroll, useTransform } from 'motion/react'
import React, { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'

export interface SectionMeta {
  index: number
  title: string
  badge: string
  code: string
  element: HTMLElement
  showCard: boolean
  /** Which bottom corner the bar takes while this section is active (`data-guide-side`). */
  side: 'left' | 'right'
}

export type SectionScrollspyProps = {
  containerRef?: RefObject<HTMLElement | null>
  selector?: string
  portal?: boolean
  className?: string
  /** Hides the bar (e.g. in the first room) without unmounting it. */
  visible?: boolean
  /** Replaces the default title card for the active section. */
  renderCard?: (section: SectionMeta) => React.ReactNode
}

export function SectionScrollspy({
  containerRef,
  selector = '[data-page-section]',
  portal = false,
  className,
  visible = true,
  renderCard,
}: SectionScrollspyProps) {
  const [sections, setSections] = useState<SectionMeta[]>([])
  const [activeSection, setActiveSection] = useState(0)
  const [showScrollCard, setShowScrollCard] = useState(false)

  useEffect(() => {
    const updateSections = () => {
      const scope = containerRef?.current ?? document
      const elements = Array.from(scope.querySelectorAll(selector)) as HTMLElement[]
      const newSections: SectionMeta[] = []
      let lastValidTitle = ''
      let lastValidBadge = ''

      elements.forEach((element) => {
        const titleEl = element.querySelector('h2')
        let title = lastValidTitle
        let badge = lastValidBadge

        if (!titleEl) return

        if (titleEl) {
          const clone = titleEl.cloneNode(true) as HTMLElement
          const badgeEl = clone.querySelector('[data-slot="badge"]')
          if (badgeEl) {
            badge = badgeEl.textContent?.trim() || ''
            badgeEl.remove()
          } else {
            badge = ''
          }
          title = element.dataset.roomTitle || clone.textContent?.trim() || ''

          lastValidTitle = title
          lastValidBadge = badge
        }

        newSections.push({
          index: newSections.length,
          title,
          badge,
          code: '',
          element,
          showCard: true,
          side: element.dataset.guideSide === 'left' ? 'left' : 'right',
        })
      })

      setSections(newSections)
    }

    updateSections()

    let pending = 0
    const observer = new MutationObserver(() => {
      if (pending) return
      pending = requestAnimationFrame(() => {
        pending = 0
        updateSections()
      })
    })
    observer.observe(containerRef?.current ?? document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      if (pending) cancelAnimationFrame(pending)
    }
  }, [containerRef, selector])

  useEffect(() => {
    if (sections.length === 0) return
    const root = containerRef?.current ?? null
    const getScrollY = () => (root ? root.scrollTop : window.scrollY)

    const handleScroll = () => {
      if (getScrollY() < 50) {
        setActiveSection(0)
        setShowScrollCard(sections[0]?.showCard || false)
      }
    }
    const scrollTarget: HTMLElement | Window = root ?? window
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting)
        if (intersecting.length > 0) {
          const entry = intersecting[0]
          const index = sections.findIndex((s) => s.element === entry.target)
          if (index !== -1 && getScrollY() >= 80) {
            setActiveSection(index)
            setShowScrollCard(sections[index]?.showCard || false)
          }
        }
      },
      {
        threshold: 0,
        root,
        rootMargin: '-35% 0px -80% 0px',
      },
    )

    sections.forEach((s) => observer.observe(s.element))
    return () => {
      observer.disconnect()
      scrollTarget.removeEventListener('scroll', handleScroll)
    }
  }, [sections, containerRef])

  if (sections.length === 0 || typeof document === 'undefined') return null

  const side = sections[activeSection]?.side ?? 'right'

  const node = (
    <div className={cn(portal ? 'relative z-50 hidden md:block' : 'contents')}>
      <ScrollBar
        key={side}
        side={side}
        renderCard={renderCard}
        sections={sections}
        activeSection={activeSection}
        showScrollCard={showScrollCard}
        containerRef={containerRef}
        portal={portal}
        className={cn(
          'transition-opacity duration-500',
          visible ? 'opacity-100' : 'pointer-events-none opacity-0',
          className,
        )}
      />
    </div>
  )

  if (portal) return createPortal(node, document.body)
  return node
}

function useContainerSize(): [
  React.RefCallback<HTMLElement>,
  { width: number; height: number; left: number; top: number },
] {
  const [size, setSize] = useState({ width: 0, height: 0, left: 0, top: 0 })
  const ref = useRef<HTMLElement | null>(null)

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node
    if (node) {
      const rect = node.getBoundingClientRect()
      setSize((prev) => {
        if (
          prev.width === rect.width &&
          prev.height === rect.height &&
          prev.left === rect.left &&
          prev.top === rect.top
        ) {
          return prev
        }
        return { width: rect.width, height: rect.height, left: rect.left, top: rect.top }
      })
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        setSize({ width: rect.width, height: rect.height, left: rect.left, top: rect.top })
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return [setRef, size]
}

const ScrollBar = ({
  sections,
  activeSection,
  showScrollCard,
  containerRef,
  portal,
  className,
  side,
  renderCard,
}: {
  side: 'left' | 'right'
  renderCard?: (section: SectionMeta) => React.ReactNode
  sections: SectionMeta[]
  activeSection: number
  showScrollCard: boolean
  containerRef?: RefObject<HTMLElement | null>
  portal: boolean
  className?: string
}) => {
  const { scrollYProgress } = useScroll(containerRef ? { container: containerRef } : undefined)
  const [trackRef, containerSize] = useContainerSize()
  const scrollX = useTransform(scrollYProgress, [0, 1], [0, containerSize.width - 1.5])
  const [isDragging, setIsDragging] = useState(false)
  const [hoverX, setHoverX] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  const motionX = useMotionValue(0)

  useEffect(() => {
    if (!isDragging) {
      const unsubscribe = scrollX.on('change', (v: number) => motionX.set(v))
      return () => unsubscribe()
    }
  }, [isDragging, scrollX, motionX])

  const ticks = useMemo(
    () =>
      [...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.2, filter: 'blur(1px)' }}
          animate={{
            opacity: i % 5 === 0 ? 1 : 0.2,
            filter: 'blur(0px)',
          }}
          transition={{
            duration: 0.2,
            delay: i % 5 === 0 ? (i / 5) * 0.05 : 0,
            ease: 'easeOut',
          }}
          className={cn('h-3.5 w-px bg-tone')}
        />
      )),
    [],
  )

  const section = sections[activeSection] || sections[0]

  const scrollToProgress = (progress: number) => {
    const root = containerRef?.current
    if (root) {
      root.scrollTo({ top: (root.scrollHeight - root.clientHeight) * progress, behavior: 'instant' as ScrollBehavior })
      return
    }
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: scrollHeight * progress, behavior: 'instant' as ScrollBehavior })
  }

  return (
    <motion.div
      initial={{ y: 14, filter: 'blur(6px)' }}
      animate={{ y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex flex-col gap-1.5 overflow-hidden border border-tone-line bg-ground-lit p-1.5',
        portal
          ? cn('fixed bottom-5 z-40 hidden md:flex', side === 'left' ? 'left-5' : 'right-5')
          : 'absolute right-3 bottom-3',
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeSection}
          initial={{ y: '100%', opacity: 0 }}
          animate={showScrollCard ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.5, bounce: 0, type: 'spring' }}
        >
          {renderCard ? renderCard(section) : <ScrollCard section={section} />}
        </motion.div>
      </AnimatePresence>

      <motion.div className="cursor-grab bg-tone-ground px-4 will-change-transform">
        <div ref={trackRef}>
          <div
            className="relative flex h-10 items-center justify-center gap-1.5 overflow-hidden"
            ref={barRef}
            onClick={(e) => {
              if (!barRef.current || isDragging) return
              const progress = Math.max(0, Math.min(1, (e.clientX - containerSize.left) / containerSize.width))
              scrollToProgress(progress)
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={(e) => {
              if (isDragging) {
                setHoverX(-20)
                return
              }
              if (barRef.current) {
                setHoverX(Math.max(0, Math.min(e.clientX - containerSize.left, containerSize.width - 6)))
              }
            }}
          >
            {ticks}

            <AnimatePresence mode="popLayout">
              {isHovering && !isDragging && (
                <motion.div
                  className="absolute h-6 w-1.5 cursor-grab rounded-full bg-gold opacity-40"
                  style={{ left: hoverX, willChange: 'transform' }}
                  transition={{ type: 'tween', duration: 0 }}
                />
              )}
            </AnimatePresence>

            <motion.div
              layout
              drag="x"
              dragControls={dragControls}
              dragConstraints={barRef}
              dragElastic={0}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDrag={(_, info) => {
                if (!barRef.current) return
                const width = containerSize.width
                const x = Math.max(0, Math.min(info.point.x - containerSize.left, width))
                const progress = x / width
                motionX.set(x)
                scrollToProgress(progress)
              }}
              onDragEnd={() => setIsDragging(false)}
              className="absolute left-0 h-6 w-1.5 cursor-grab rounded-full bg-gold active:cursor-grabbing"
              style={{ x: motionX }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ScrollCard = ({ section }: { section: SectionMeta }) => {
  if (!section.title) return null

  return (
    <div className="relative flex w-78.75 max-w-78.75 items-center bg-marble px-3 py-2.5">
      <div className="flex-1 overflow-x-auto whitespace-nowrap">
        <span className="flex items-center justify-between gap-3 text-[0.875rem] font-medium text-ink">
          {section.title}
          {section.badge && (
            <span data-slot="badge" lang="el" className="text-[0.75rem] font-medium tracking-[0.12em] text-gold-deep">
              {section.badge}
            </span>
          )}
        </span>
      </div>
    </div>
  )
}
