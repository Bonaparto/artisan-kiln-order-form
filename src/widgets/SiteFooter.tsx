const LINKS = ['Terms of service', 'Privacy policy', 'Shipping info', 'Contact us'];

export function SiteFooter() {
  return (
    <footer className="relative z-10 u-pt-12 u-pb-2 text-center u-text-10.5 font-semibold uppercase lg:pt-4 lg:pb-[10px] lg:text-[14.5px]">
      {/* Mobile mockup: just two links. */}
      <nav aria-label="Footer" className="lg:hidden">
        <ul className="flex justify-center u-gap-10">
          <li>
            <a href="#" className="hover:underline">
              Terms
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </nav>
      <nav aria-label="Footer" className="hidden lg:block">
        <ul className="flex justify-center">
          {LINKS.map((label, index) => (
            <li key={label} className="flex items-center">
              {index > 0 && (
                <span aria-hidden className="mx-2">
                  |
                </span>
              )}
              <a href="#" className="hover:underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-1 hidden text-[13.5px] lg:block">© 2026 The Artisan Kiln. All rights reserved.</p>
    </footer>
  );
}
