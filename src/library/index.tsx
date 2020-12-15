import {cloneDeep, merge} from 'lodash-es';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';

export type BezierPlacementX = 'left' | 'right';
export type BezierPlacementY = 'top' | 'bottom';

export type BezierPlacement =
  | BezierPlacementX
  | BezierPlacementY
  | `${BezierPlacementY}-${BezierPlacementX}`
  | `${BezierPlacementX}-${BezierPlacementY}`;

export type BezierNode =
  | React.RefObject<Element>
  | Element
  | 'previousElementSibling'
  | 'nextElementSibling'
  | 'parentElement'
  | 'parentPreviousElementSibling'
  | 'parentNextElementSibling'
  | ((elem: Element) => Element);

export interface BezierProps {
  className?: string;
  stroke?: BezierStroke;
  rect?: BezierRect;
  placement?: BezierPlacementOptions;
  /**
   * 始端节点, 默认 `previousElementSibling`
   * Start node, default `previousElementSibling`
   */
  startNode?: BezierNode;
  /**
   * 尾端节点, 默认 `nextElementSibling`
   * End node, default `nextElementSibling`
   */
  endNode?: BezierNode;
  /**
   * 是否监听节点变化, 自动重绘, 默认 `true`
   * Whether to monitor node changes and automatically redraw, default `true`
   */
  observer?: boolean;
}

export interface BezierStroke {
  /**
   * 画笔颜色, 默认 `#000`
   * Pen color, default `#000`
   */
  color?: string;
  /**
   * 画笔虚线, 默认 `undefined`
   * Pen dotted line, default `undefined`
   */
  dasharray?: number | undefined;
  /**
   * 画笔宽度, 默认 2
   * Brush width, default 2
   */
  width?: number;
}

export interface BezierRect {
  /**
   * 实际占位宽度, 默认 12
   * Actual width, default 12
   */
  width?: number | string;
  /**
   * 实际占位高度, 默认 12
   * Actual height, default 12
   */
  height?: number | string;
}

export interface BezierPlacementOptions {
  /**
   * 开始节点方位
   * Starting node position
   */
  start?: BezierPlacement;
  /**
   * 缩进, 默认 24
   * Indentation, default 24
   */
  startIndent?: number;
  /**
   * 偏移量, `(x-y | y-x)` 默认 12, `(x | y)` 忽略
   * Offset, `(x-y | y-x)` default 12, `(x | y)` ignore
   */
  startOffset?: number;
  /**
   * 结束节点方位
   * End node position
   */
  end?: BezierPlacement;
  /**
   * 缩进, 默认 24
   * Indentation, default 24
   */
  endIndent?: number;
  /**
   * 偏移量, `(x-y | y-x)` 默认 12, `(x | y)` 忽略
   * Offset, `(x-y | y-x)` default 12, `(x | y)` ignore
   */
  endOffset?: number;
  /**
   * 转折点, 默认 `startIndent + endIndent`
   * Turning point, default `startIndent + endIndent`
   *
   * **数值越小，两点间的线越直**
   * **The smaller the value, the straighter the line between the two points**
   */
  turningPoint?: number;
}

/**
 * props 默认值
 */
export const BEZIER_PROPS_DEFAULT: Required<BezierProps> = {
  className: 'rc-bezier',
  stroke: {
    color: '#000',
    width: 2,
  },
  rect: {
    width: 12,
    height: 12,
  },
  placement: {
    start: 'bottom',
    startIndent: 24,
    startOffset: 12,
    end: 'top',
    endIndent: 24,
    endOffset: 12,
  },
  startNode: 'previousElementSibling',
  endNode: 'nextElementSibling',
  observer: true,
};

/**
 * @ignore
 */
interface RectDict {
  wrapper: Partial<DOMRect>;
  start: Partial<DOMRect>;
  end: Partial<DOMRect>;
}

/**
 * Bezier Component
 * @ignore
 */
export const Bezier: FC<BezierProps> = _props => {
  const {
    className,
    stroke,
    rect: svgRect,
    placement,
    observer: observerSetting,
    startNode,
    endNode,
  } = merge<Required<BezierProps>, BezierProps>(
    {...cloneDeep(BEZIER_PROPS_DEFAULT)},
    _props,
  );

  // eslint-disable-next-line no-null/no-null
  const svgRef = useRef<SVGSVGElement>(null);

  const [rect, setRect] = useState<RectDict>({wrapper: {}, start: {}, end: {}});

  const onDomChange = useCallback(() => {
    const wrapper = svgRef.current;

    if (!wrapper) {
      return;
    }

    setRect({
      wrapper: wrapper.getBoundingClientRect(),
      start: getBezierNodeDomRect(wrapper, startNode),
      end: getBezierNodeDomRect(wrapper, endNode),
    });
  }, [svgRef, startNode, endNode]);

  useEffect(() => {
    const wrapper = svgRef.current;

    if (!wrapper) {
      return;
    }

    onDomChange();

    let start = getBezierNodeDom(wrapper, startNode);
    let end = getBezierNodeDom(wrapper, endNode);

    let observer: MutationObserver | undefined;

    if (!observerSetting) {
      return;
    }

    observer = new MutationObserver(onDomChange);

    observer.observe(wrapper, {attributes: true});
    observer.observe(start!, {attributes: true});
    observer.observe(end!, {attributes: true});

    return () => {
      observer?.disconnect();
    };
  }, [svgRef, observerSetting, startNode, endNode, onDomChange]);

  let {color, dasharray, width} = stroke;

  return (
    <svg
      className={className}
      ref={svgRef}
      style={{
        ...svgRect,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <path
        d={generateD(rect, placement)}
        stroke={color}
        strokeDasharray={dasharray}
        strokeWidth={width}
        fill="none"
        style={{pointerEvents: 'auto'}}
      />
    </svg>
  );
};

function generateD(
  {wrapper, start: startNode, end: endNode}: RectDict,
  placement: BezierPlacementOptions,
): string {
  let {
    start,
    startOffset,
    startIndent,
    end,
    endOffset,
    endIndent,
    turningPoint,
  } = placement;

  let sp = getPointXY(startNode, start!, wrapper, startOffset);
  let np = getPointXY(endNode, end!, wrapper, endOffset);

  let tp =
    turningPoint === undefined ? startIndent! + endIndent! : turningPoint;

  return `M ${sp} C ${getIndentXY(sp, start!, startIndent!)} ${getIndentXY(
    sp,
    start!,
    tp,
  )} ${(sp[0] + np[0]) / 2}, ${(sp[1] + np[1]) / 2} S ${getIndentXY(
    np,
    end!,
    endIndent!,
  )} ${np}`;
}

function getPointXY(
  {left = 0, top = 0, width = 0, height = 0}: Partial<DOMRect>,
  placement: BezierPlacement,
  {left: baseX = 0, top: baseY = 0}: Partial<DOMRect>,
  offset: number = 0,
): [number, number] {
  let x!: number;
  let y!: number;

  let segments = placement.split('-');

  for (let segment of segments) {
    switch (segment) {
      case 'left':
        x = left;
        break;
      case 'right':
        x = left + width;
        break;
      case 'top':
        y = top;
        break;
      case 'bottom':
        y = top + height;
        break;
      default:
        break;
    }
  }

  /**
   * 单 x 或 y，offset 不生效
   */
  if (segments.length === 2) {
    switch (segments[1]) {
      case 'left':
        x += offset;
        break;
      case 'right':
        x -= offset;
        break;
      case 'top':
        y += offset;
        break;
      case 'bottom':
        y -= offset;
        break;
    }
  }

  if (x === undefined) {
    x = left + width / 2;
  }

  if (y === undefined) {
    y = top + height / 2;
  }

  return [x - baseX, y - baseY];
}

function getIndentXY(
  [x, y]: [number, number],
  placement: BezierPlacement,
  indent: number,
): [number, number] {
  switch (placement.split('-')[0]) {
    case 'left':
      x -= indent;
      break;
    case 'right':
      x += indent;
      break;
    case 'top':
      y -= indent;
      break;
    case 'bottom':
      y += indent;
      break;
  }

  return [x, y];
}

function getBezierNodeDom(
  target: Element,
  node: BezierNode,
): Element | null | undefined {
  if (typeof node === 'function') {
    return node(target);
  }

  if (typeof node === 'string') {
    switch (node) {
      case 'nextElementSibling':
      case 'previousElementSibling':
      case 'parentElement':
        return target[node];

      case 'parentPreviousElementSibling':
        return target.parentElement?.previousElementSibling;
      case 'parentNextElementSibling':
        return target.parentElement?.nextElementSibling;
      default:
        return;
    }
  }

  if ('current' in node) {
    return node.current;
  }

  return node;
}

function getBezierNodeDomRect(
  target: Element,
  node: BezierNode,
): Partial<DOMRect> {
  return getBezierNodeDom(target, node)?.getBoundingClientRect() || {};
}
