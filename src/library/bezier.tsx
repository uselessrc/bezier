import React, {FC, useCallback, useEffect, useRef, useState} from 'react';

import {fillProps} from './@default';
import {useMouseEvent} from './@event';
import {generatePoints, getNodeElement, getNodeElementRect} from './@utils';
import {BezierProps} from './bezier.doc';
import {MarkList} from './mark';

/**
 * @ignore
 */
export interface RectDict {
  wrapper: DOMRect | undefined;
  start: DOMRect | undefined;
  end: DOMRect | undefined;
}

/**
 * Bezier Component
 * @ignore
 */
export const Bezier: FC<BezierProps> = props => {
  const {
    className,
    style,
    stroke,
    rect: svgRect,
    placement,
    observer: observerSetting,
    startNode,
    endNode,
    marks,
    generatePath,
  } = fillProps(props);

  // eslint-disable-next-line no-null/no-null
  const wrapperRef = useRef<any>(null);

  const [rect, setRect] = useState<RectDict>({
    wrapper: undefined,
    start: undefined,
    end: undefined,
  });

  const updateRectCallback = useCallback(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    let rectDict = {
      wrapper: wrapper.getBoundingClientRect(),
      start: getNodeElementRect(wrapper, startNode),
      end: getNodeElementRect(wrapper, endNode),
    };

    setRect(rectDict);

    return rectDict;
  }, [wrapperRef, startNode, endNode]);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    if (!isQualified(updateRectCallback())) {
      console.error('[rc-bezier]: Start node or end node missing !');
      return;
    }

    if (!observerSetting) {
      return;
    }

    let start = getNodeElement(wrapper, startNode)!;
    let end = getNodeElement(wrapper, endNode)!;

    let observer = new MutationObserver(updateRectCallback);
    observer.observe(wrapper, {attributes: true});
    observer.observe(start, {attributes: true});
    observer.observe(end, {attributes: true});

    return () => {
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerSetting, updateRectCallback]);

  let {color, dasharray, width} = stroke;

  let qualified = isQualified(rect);
  let points = qualified ? generatePoints(rect, placement) : [];
  let d = points.length ? generatePath(points) : undefined;

  let [pathProps] = useMouseEvent(marks, points[0]);

  return (
    <div
      className={className}
      ref={wrapperRef}
      style={{...style, ...svgRect, position: 'relative'}}
    >
      <svg
        style={{
          ...svgRect,
          display: 'block',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {qualified ? (
          <path
            key={d}
            d={d}
            stroke={color}
            strokeDasharray={dasharray}
            strokeWidth={width}
            fill="transparent"
            style={{pointerEvents: 'visibleStroke'}}
            {...pathProps}
          />
        ) : undefined}
      </svg>

      <MarkList points={points} marks={marks} />
    </div>
  );
};

export function isQualified(rect: RectDict | undefined): boolean {
  return !!(rect && Object.values(rect).every(val => !!val));
}
