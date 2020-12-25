import {cloneDeep, merge} from 'lodash-es';

import {BezierProps} from './bezier.doc';

/**
 * props 默认值
 */
export const BEZIER_PROPS_DEFAULT: Required<BezierProps> = {
  className: 'rc-bezier',
  style: {},
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
  startNode: 'previousSibling',
  endNode: 'nextSibling',
  observer: true,
  marks: [],
};

export function fillProps(props: BezierProps): Required<BezierProps> {
  const defaultProps = cloneDeep(BEZIER_PROPS_DEFAULT);

  const {
    className = defaultProps.className,
    style = defaultProps.style,
    startNode = defaultProps.startNode,
    endNode = defaultProps.endNode,
    observer = defaultProps.observer,
    marks = defaultProps.marks,
    stroke,
    rect,
    placement,
  } = props;

  return {
    className,
    style,
    startNode,
    endNode,
    observer,
    marks,
    stroke: merge(defaultProps.stroke, stroke),
    rect: merge(defaultProps.rect, rect),
    placement: merge(defaultProps.placement, placement),
  };
}
