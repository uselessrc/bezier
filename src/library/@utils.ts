import {RectDict} from './bezier';
import {
  BezierNode,
  BezierNodeSelector,
  BezierPlacement,
  BezierPlacementOptions,
  BezierPoint,
} from './bezier.doc';

export function generatePoints(
  {wrapper, start: startNode, end: endNode}: RectDict,
  placement: BezierPlacementOptions,
): BezierPoint[] {
  let {
    start,
    startOffset,
    startIndent,
    end,
    endOffset,
    endIndent,
    turningPoint,
  } = placement;

  let sp = generatePoint(startNode, start!, wrapper, startOffset);
  let np = generatePoint(endNode, end!, wrapper, endOffset);

  let tp =
    turningPoint === undefined ? startIndent! + endIndent! : turningPoint;

  return [
    sp,
    generateIndentPoint(sp, start!, startIndent!),
    generateIndentPoint(sp, start!, tp),
    {
      x: (sp.x + np.x) / 2,
      y: (sp.y + np.y) / 2,
    },
    generateIndentPoint(np, end!, tp),
    generateIndentPoint(np, end!, endIndent!),
    np,
  ];
}

export function generateD([p1, p2, p3, p4, , p6, p7]: BezierPoint[]): string {
  return `M ${flatPoint(p1)} C ${flatPoint(p2)} ${flatPoint(p3)} ${flatPoint(
    p4,
  )} S ${flatPoint(p6)} ${flatPoint(p7)}`;
}

export function getNodeElement(
  target: Element,
  node: BezierNode,
): Element | null | undefined {
  if (typeof node === 'function') {
    return node(target);
  }

  if (typeof node === 'string') {
    return resolveSelector(target, node);
  }

  if (Array.isArray(node)) {
    let element: Element | null = target;

    for (let selector of node) {
      element = resolveSelector(element, selector);

      if (!element) {
        return undefined;
      }
    }

    return element;
  }

  if ('current' in node) {
    return node.current;
  }

  return node;
}

export function getNodeElementRect(
  target: Element,
  node: BezierNode,
): DOMRect | undefined {
  return getNodeElement(target, node)?.getBoundingClientRect();
}

export function getProgressPoint(
  points: BezierPoint[],
  progress: number,
): BezierPoint {
  let x = 0;
  let y = 0;
  let n = points.length - 1;

  points.forEach(({x: px, y: py}, index) => {
    if (!index) {
      x += px * Math.pow(1 - progress, n - index) * Math.pow(progress, index);
      y += py * Math.pow(1 - progress, n - index) * Math.pow(progress, index);
    } else {
      x +=
        (factorial(n) / factorial(index) / factorial(n - index)) *
        px *
        Math.pow(1 - progress, n - index) *
        Math.pow(progress, index);
      y +=
        (factorial(n) / factorial(index) / factorial(n - index)) *
        py *
        Math.pow(1 - progress, n - index) *
        Math.pow(progress, index);
    }
  });

  return {x, y};
}

function flatPoint(point: BezierPoint): string {
  return `${point.x},${point.y}`;
}

function generatePoint(
  {left = 0, top = 0, width = 0, height = 0}: Partial<DOMRect> = {},
  placement: BezierPlacement,
  {left: baseX = 0, top: baseY = 0}: Partial<DOMRect> = {},
  offset: number = 0,
): BezierPoint {
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

  return {
    x: +(x - baseX).toFixed(4),
    y: +(y - baseY).toFixed(4),
  };
}

function generateIndentPoint(
  {x, y}: BezierPoint,
  placement: BezierPlacement,
  indent: number,
): BezierPoint {
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

  return {x, y};
}

function resolveSelector(
  element: Element,
  selector: BezierNodeSelector,
): Element | null {
  return element[
    selector.replace(/(?=[A-Z]|$)/, 'Element') as keyof Element
  ] as Element;
}

function factorial(num: number): number {
  if (num <= 1) {
    return 1;
  } else {
    return num * factorial(num - 1);
  }
}
