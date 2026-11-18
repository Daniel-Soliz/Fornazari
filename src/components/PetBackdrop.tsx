import { useEffect, useRef } from 'react';
import { Dog, PawPrint } from 'lucide-react';

export function PetBackdrop() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, x = 0, y = 0;
    function update() {
      frame = 0;
      const offset = preference.matches ? 0 : Math.min(50, window.scrollY * 0.055);
      layer.current?.style.setProperty('--scene-shift', `translate(${x}px, ${y - offset}px)`);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function point(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || preference.matches) return;
      x = (event.clientX / innerWidth - 0.5) * 24;
      y = (event.clientY / innerHeight - 0.5) * 16;
      schedule();
    }
    window.addEventListener('pointermove', point);
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', point);
      window.removeEventListener('scroll', schedule);
    };
  }, []);
  return <div ref={layer} className="pet-backdrop" aria-hidden="true"><div className="pet-scenery">
    <Dog className="dog-outline" strokeWidth={0.85}/><PawPrint className="paw-one" strokeWidth={1}/>
    <PawPrint className="paw-two" strokeWidth={1}/><PawPrint className="paw-three" strokeWidth={1}/>
  </div></div>;
}
