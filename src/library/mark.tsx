import React, {
  CSSProperties,
  DOMAttributes,
  FC,
  ReactNode,
  SVGProps,
} from 'react';

import {BezierMouseEventHandler} from './@event';
import {getProgressPoint} from './@utils';
import {BezierPoint} from './bezier.doc';

export interface Mark
  extends Partial<
    Record<
      keyof DOMAttributes<SVGProps<SVGPathElement>>,
      BezierMouseEventHandler
    >
  > {
  key: string;
  render: ReactNode;
  /**
   * 相对于起点的坐标或进度(0-1)
   * Coordinates relative to the starting point or progress(0-1)
   */
  position?: number | BezierPoint;
  wrapperStyle?: CSSProperties;
}

const MarkWrapper: FC<{position: BezierPoint; style?: CSSProperties}> = ({
  position,
  style,
  children,
}) => {
  return (
    <div
      className="rc-bezier-mark-wrapper"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate3D(calc(${position.x}px - 50%), calc(${position.y}px - 50%), 0)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * MarkList Component
 * @ignore
 */
export const MarkList: FC<{
  points: BezierPoint[];
  marks: Mark[];
}> = ({points, marks}) => {
  return (
    <div
      className="rc-bezier-mark-list"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    >
      {marks.map(mark => {
        let position!: BezierPoint;

        if (typeof mark.position === 'number') {
          let rate = mark.position * 2;

          position =
            rate > 1
              ? getProgressPoint(points.slice(-4), rate - 1)
              : getProgressPoint(points.slice(0, 4), rate);
        } else {
          let [{x: sx = 0, y: sy = 0} = {x: 0, y: 0}] = points;

          position = mark.position
            ? {
                x: mark.position.x + sx,
                y: mark.position.y + sy,
              }
            : {x: 0, y: 0};
        }

        return (
          <MarkWrapper
            key={mark.key}
            position={position}
            style={mark.wrapperStyle}
          >
            {mark.render}
          </MarkWrapper>
        );
      })}
    </div>
  );
};
