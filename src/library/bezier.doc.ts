import {Mark} from './mark';

export interface BezierProps {
  className?: string;
  style?: React.CSSProperties;
  stroke?: BezierStroke;
  rect?: BezierRect;
  placement?: BezierPlacementOptions;
  /**
   * 始端节点, 默认 `previousSibling`
   * Start node, default `previousSibling`
   */
  startNode?: BezierNode;
  /**
   * 尾端节点, 默认 `nextSibling`
   * End node, default `nextSibling`
   */
  endNode?: BezierNode;
  /**
   * 是否监听节点变化, 自动重绘, 默认 `{attributes: true}`
   * Whether to monitor node changes and automatically redraw, default `true`
   */
  observer?: BezierObserver | false;
  marks?: Mark[];
  generatePath?: (points: BezierPoint[]) => string;
}

export type BezierPlacementX = 'left' | 'right';
export type BezierPlacementY = 'top' | 'bottom';
export type BezierPlacement =
  | BezierPlacementX
  | BezierPlacementY
  | `${BezierPlacementY}-${BezierPlacementX}`
  | `${BezierPlacementX}-${BezierPlacementY}`;

export type BezierNodeParentSelector = 'parent';
export type BezierNodeSiblingSelector = 'previousSibling' | 'nextSibling';
export type BezierNodeChildSelector = 'firstChild' | 'lastChild';
export type BezierNodeSelector =
  | BezierNodeParentSelector
  | BezierNodeSiblingSelector
  | BezierNodeChildSelector;

export type BezierNode =
  | React.RefObject<Element>
  | Element
  | BezierNodeSelector
  | BezierNodeSelector[]
  | ((elem: Element) => Element);

export interface BezierObserver extends MutationObserverInit {}

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

export interface BezierPoint {
  x: number;
  y: number;
}
