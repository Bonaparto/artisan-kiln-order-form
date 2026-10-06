'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { selectCartLineCount } from '@/features/cart/model/selectors';
import { AvatarIcon, CartIcon } from '@/shared/icons';
import { cn } from '@/shared/lib/cn';
import { WindowDots } from '@/shared/illustrations';
import { useAppSelector } from '@/store/hooks';

const NAV = [
  { label: 'Home', desktopOnly: true },
  { label: 'Shop' },
  { label: 'Collections' },
  { label: 'About us' },
  { label: 'FAQ', desktopOnly: true },
  { label: 'Gallery', desktopOnly: true },
  { label: 'Blog', desktopOnly: true },
];

/** The "browser window" bar from the mockups: window dots, site navigation, cart and account. */
export function TopBar() {
  const cartCount = useAppSelector(selectCartLineCount);

  return (
    <header className="relative flex h-[36px] items-center gap-1.5 border-b-2 border-ink bg-sand px-2 sm:h-[48px] sm:gap-2 sm:px-3 lg:h-[37px]">
      <WindowDots className="shrink-0" />
      <nav
        aria-label="Main"
        className="min-w-0 flex-1 lg:absolute lg:inset-x-0 lg:top-0 lg:flex lg:h-full lg:translate-x-[12px] lg:items-center lg:justify-center"
      >
        <ul className="flex items-center justify-center gap-x-[clamp(8px,3.4vw,34px)] text-[14px] font-semibold whitespace-nowrap uppercase min-[400px]:text-[15px] sm:text-[19px] lg:gap-x-[24px] lg:text-[19.5px]">
          {NAV.map((item) => (
            <li key={item.label} className={cn(item.desktopOnly && 'hidden lg:block')}>
              <a href="#" className="decoration-2 underline-offset-4 hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="relative ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-2.5">
        <a
          href="#cart"
          className="relative block"
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
        >
          <CartIcon className="h-[22px] w-[26px] sm:h-[26px] sm:w-[30px] lg:h-[24px] lg:w-[28px]" />
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={cartCount}
              aria-hidden
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 22 }}
              className="absolute -top-1.5 -right-1.5 grid size-[17px] place-items-center rounded-full border-[1.5px] border-ink bg-mustard text-[11px] leading-none font-bold"
            >
              {cartCount}
            </motion.span>
          </AnimatePresence>
        </a>
        <AvatarIcon className="size-[24px] sm:size-[30px] lg:size-[27px]" />
        <a
          href="#"
          className="rounded-[6px] border-[1.5px] border-ink bg-navy px-1.5 py-[3px] text-[14px] leading-none font-medium whitespace-nowrap text-cream-light transition-colors hover:bg-navy-dark sm:px-2 sm:text-[17px] lg:hidden"
        >
          Log In
        </a>
        <a
          href="#"
          aria-label="Account: A. Smith"
          className="hidden rounded-[5px] border-[1.5px] border-ink bg-navy px-2 py-[3px] text-[15px] leading-none font-medium text-cream-light transition-colors hover:bg-navy-dark lg:block"
        >
          A. Smith
        </a>
      </div>
    </header>
  );
}
