import React, {FC, useCallback, useEffect, useRef, useState} from 'react';

export interface BezierProps {}

export const Bezier: FC<BezierProps> = () => {
  // eslint-disable-next-line no-null/no-null
  const wrapperRef = useRef<SVGSVGElement>(null);

  const [rect, setRect] = useState<{
    previous: Partial<DOMRect>;
    next: Partial<DOMRect>;
  }>({previous: {}, next: {}});

  const onDomChange = useCallback(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    let previous = wrapper.previousElementSibling;
    let next = wrapper.nextElementSibling;

    setRect({
      previous: previous?.getBoundingClientRect() || {},
      next: next?.getBoundingClientRect() || {},
    });
  }, [wrapperRef]);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    onDomChange();

    let previous = wrapper.previousElementSibling;
    let next = wrapper.nextElementSibling;

    const observer = new MutationObserver(onDomChange);

    observer.observe(previous!, {attributes: true});
    observer.observe(next!, {attributes: true});

    return () => {
      observer.disconnect();
    };
  }, [wrapperRef, onDomChange]);

  let {
    previous: {left: pl = 0, top: pt = 0, width: pw = 0, height: ph = 0},
    next: {left: nl = 0, top: nt = 0, width: nw = 0},
  } = rect;

  let p1 = 20;
  let p2 = 200;

  let m = `M ${pl + pw / 2}, ${pt + ph}`;
  let c = `C ${pl + pw / 2}, ${pt + ph + p1} ${pl + pw / 2}, ${pt + ph + p2} ${
    (pl + pw / 2 + nl + nw / 2) / 2
  }, ${(pt + ph + nt) / 2} `;
  let s = `S ${nl + nw / 2}, ${nt - p1} ${nl + nw / 2}, ${nt}`;

  return (
    <svg
      ref={wrapperRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 24,
        height: 24,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <path
        d={`${m} ${c} ${s}`}
        stroke="#000"
        strokeDasharray="4"
        fill="none"
        style={{strokeWidth: 2, pointerEvents: 'auto'}}
        onMouseEnter={e => {
          (e.target as SVGPathElement).setAttribute('stroke', 'red');
        }}
      />
    </svg>
  );
};
