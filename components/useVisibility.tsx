import React from 'react';

export function useVisibility<HTMLDivElement>(offset = 0): [boolean, React.RefObject<HTMLDivElement>] {
  const [isVisible, setIsVisible] = React.useState(true);
  const currentElement = React.useRef<HTMLDivElement | null>(null); //(null);

  const onScroll = () => {

    const el = (currentElement && currentElement.current) || null;

    if (!(el instanceof Element)) {
      setIsVisible(false);
      return;
    }

    const top = el.getBoundingClientRect().top;
    setIsVisible(((top + offset) >= 0) && ((top - offset) <= window.innerHeight));
    console.log(isVisible ? 'true' : 'false');
  };

  React.useEffect(() => {
    document.addEventListener('scroll', onScroll, true);
    return () => document.removeEventListener('scroll', onScroll, true);
  });

  return [isVisible, currentElement];
}
