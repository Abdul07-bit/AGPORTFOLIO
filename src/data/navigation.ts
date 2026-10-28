export type NavId = 'work' | 'about' | 'stack' | 'contact'

export const primaryNav: { id: NavId; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Every section on the home page, in scroll order. `nav` decides which
 * primary navigation item is highlighted while the section is in view.
 */
export const homeSections: { id: string; label: string; nav: NavId | null }[] = [
  { id: 'top', label: 'Index', nav: null },
  { id: 'work', label: 'Selected work', nav: 'work' },
  { id: 'about', label: 'About', nav: 'about' },
  { id: 'approach', label: 'Approach', nav: 'about' },
  { id: 'stack', label: 'Stack', nav: 'stack' },
  { id: 'journey', label: 'Journey', nav: 'about' },
  { id: 'case-files', label: 'Case files', nav: 'work' },
  { id: 'contact', label: 'Contact', nav: 'contact' },
]
