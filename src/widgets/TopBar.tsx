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
    <header className="relative flex u-h-27 items-center border-b-2 border-ink bg-sand u-px-8 lg:h-[37px] lg:px-3">
      <WindowDots className="shrink-0" />
      <nav
        aria-label="Main"
        className="u-ml-16 min-w-0 lg:absolute lg:inset-x-0 lg:top-0 lg:ml-0 lg:flex lg:h-full lg:translate-x-[12px] lg:items-center lg:justify-center"
      >
        <ul className="flex items-center u-gap-x-21 u-text-13.5 font-semibold whitespace-nowrap uppercase lg:gap-x-[24px] lg:text-[19.5px]">
          {NAV.map((item) => (
            <li key={item.label} className={cn(item.desktopOnly && 'hidden lg:block')}>
              <a href="#" className="decoration-2 underline-offset-4 hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="relative ml-auto flex shrink-0 items-center">
        <a
          href="#cart"
          className="relative block lg:-translate-y-[1.5px]"
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
        >
          <CartIcon className="u-h-18.5 u-w-20.5 lg:h-[22.75px] lg:w-[25.25px]" />
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={cartCount}
              aria-hidden
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 22 }}
              className="absolute u-top-n-3.5 u-right-n-5 grid u-size-11.5 place-items-center rounded-full border border-ink bg-mustard u-text-8 leading-none font-bold lg:-top-[6px] lg:-right-[10px] lg:size-[17px] lg:border-[1.5px] lg:text-[11px]"
            >
              {cartCount}
            </motion.span>
          </AnimatePresence>
        </a>
        <AvatarIcon className="u-ml-23 u-size-20.75 lg:ml-[27.5px] lg:size-[27px]" />
        <a
          href="#"
          className="u-ml-7 u-rounded-4 border border-ink bg-navy u-px-5 u-py-2.5 u-text-12 leading-none font-medium whitespace-nowrap text-cream-light transition-colors hover:bg-navy-dark lg:hidden"
        >
          Log In
        </a>
        <a
          href="#"
          aria-label="Account: A. Smith"
          className="ml-[5px] hidden rounded-[5px] border-[1.5px] border-ink bg-navy px-2 py-[3px] text-[15px] leading-none font-medium text-cream-light transition-colors hover:bg-navy-dark lg:block"
        >
          A. Smith
        </a>
      </div>
    </header>
  );
}
