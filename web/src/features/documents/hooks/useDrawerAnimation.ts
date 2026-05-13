import { useEffect, useRef, useState } from "react";

interface UseDrawerAnimationResult {
  visibleDocId: string | null;
  drawerOpacity: number;
  drawerTranslateY: number;
}

export function useDrawerAnimation(activeDocId: string | null): UseDrawerAnimationResult {
  const [visibleDocId, setVisibleDocId] = useState<string | null>(null);
  const [drawerOpacity, setDrawerOpacity] = useState(0);
  const [drawerTranslateY, setDrawerTranslateY] = useState(8);
  const animFrameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (animFrameRef.current) clearTimeout(animFrameRef.current);

    if (activeDocId === null) {
      // Closing: fade out, then clear visibleDocId
      setDrawerOpacity(0);
      setDrawerTranslateY(8);
      animFrameRef.current = setTimeout(() => setVisibleDocId(null), 220);
    } else if (visibleDocId === null) {
      // Opening fresh: set content immediately, then fade in
      setVisibleDocId(activeDocId);
      setDrawerOpacity(0);
      setDrawerTranslateY(10);
      animFrameRef.current = setTimeout(() => {
        setDrawerOpacity(1);
        setDrawerTranslateY(0);
      }, 16); // next paint
    } else {
      // Switching docs: fade out → swap → fade in
      setDrawerOpacity(0);
      setDrawerTranslateY(6);
      animFrameRef.current = setTimeout(() => {
        setVisibleDocId(activeDocId);
        setDrawerTranslateY(-6); // come from slightly above for direction feel
        animFrameRef.current = setTimeout(() => {
          setDrawerOpacity(1);
          setDrawerTranslateY(0);
        }, 16);
      }, 160);
    }

    return () => {
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocId]);

  return { visibleDocId, drawerOpacity, drawerTranslateY };
}
