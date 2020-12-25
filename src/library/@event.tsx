import {
  MouseEvent,
  MouseEventHandler,
  SVGProps,
  useEffect,
  useRef,
  useState,
} from 'react';

import {BezierPoint} from './bezier.doc';
import {Mark} from './mark';

export type BezierMouseEventHandler = (
  point: BezierPoint,
  ...args: Parameters<MouseEventHandler>
) => void;

export function useMouseEvent(
  _marks: Mark[],
  {x, y}: BezierPoint = {x: 0, y: 0},
): [SVGProps<SVGPathElement>] {
  const marks = useRef<Mark[]>([]);
  const startPoint = useRef<BezierPoint>({x: 0, y: 0});

  const [props, setProps] = useState<SVGProps<SVGPathElement>>({});

  useEffect(() => {
    marks.current = [..._marks];
  }, [_marks]);

  useEffect(() => {
    startPoint.current = {x, y};
  }, [x, y]);

  useEffect(() => {
    const onMouseEvent = (eventName: keyof Mark): any => {
      return (event: MouseEvent) => {
        let {offsetX, offsetY} = event.nativeEvent;
        let {x, y} = startPoint.current;

        let point = {x: offsetX - x, y: offsetY - y};

        for (let mark of marks.current) {
          let handler = mark[eventName];

          if (typeof handler !== 'function') {
            continue;
          }

          handler(point, event);
        }
      };
    };

    setProps(
      [
        'onClick',
        'onClickCapture',
        'onDoubleClick',
        'onDoubleClickCapture',
        'onMouseDown',
        'onMouseDownCapture',
        'onMouseEnter',
        'onMouseLeave',
        'onMouseMove',
        'onMouseMoveCapture',
        'onMouseOut',
        'onMouseOutCapture',
        'onMouseOver',
        'onMouseOverCapture',
        'onMouseUp',
        'onMouseUpCapture',
        'onTouchMove',
        'onTouchMoveCapture',
        'onTouchCancel',
        'onTouchCancelCapture',
        'onTouchEnd',
        'onTouchEndCapture',
        'onTouchStart',
        'onTouchStartCapture',
      ].reduce<SVGProps<SVGPathElement>>(
        (props: any, eventName: keyof Mark) => {
          props[eventName] = onMouseEvent(eventName);
          return props;
        },
        {},
      ),
    );
  }, []);

  return [props];
}
