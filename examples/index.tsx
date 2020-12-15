import React, {FC, Fragment} from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line no-restricted-imports
import {Bezier} from '../src/library';

import './index.css';

import {useDocumentEvent, useNamedState} from './@utils';

const APP: FC = () => {
  const {moving, setMoving} = useNamedState<
    'moving',
    {ele: HTMLElement; offset: {x: number; y: number}} | false
  >('moving', false);

  useDocumentEvent('mousedown', (e: MouseEvent): void => {
    let ele = e.target as HTMLElement;

    if (!ele.classList.contains('block')) {
      return;
    }

    setMoving({ele, offset: {x: e.offsetX, y: e.offsetY}});
  });

  useDocumentEvent('mousemove', (e: MouseEvent): void => {
    if (!moving) {
      return;
    }

    let {
      ele,
      offset: {x, y},
    } = moving;

    let {scrollTop, scrollLeft} = document.documentElement;

    Object.assign<CSSStyleDeclaration, Partial<CSSStyleDeclaration>>(
      ele.style,
      {
        position: 'absolute',
        left: `${e.clientX - x + scrollLeft}px`,
        top: `${e.clientY - y + scrollTop}px`,
      },
    );
  });

  useDocumentEvent('mouseup', () => setMoving(false));

  return (
    <Fragment>
      <div className="father">
        <div className="block">block 1</div>
        <Bezier />
        <div className="block">block 2</div>
      </div>

      <div className="father">
        <div className="block">block 1</div>
        <Bezier placement={{start: 'bottom', end: 'top'}} />
        <div className="block">block 2</div>
        <Bezier placement={{start: 'right', end: 'bottom'}} />
        <div className="block">block 3</div>
        <Bezier
          placement={{start: 'top', end: 'right'}}
          endNode={ele => ele.parentElement?.firstElementChild!}
        />
      </div>

      <div className="father">
        {Array(3)
          .fill(undefined)
          .map((_, index) => {
            return (
              <Fragment key={index}>
                <Bezier
                  placement={{
                    start: 'top',
                    end: 'top',
                    turningPoint: 0,
                    startIndent: -40,
                    endIndent: 10,
                  }}
                  stroke={{
                    color: 'red',
                    dasharray: 3,
                  }}
                  startNode="parentElement"
                />
                <div className="block">block {index + 1}</div>
              </Fragment>
            );
          })}
      </div>
    </Fragment>
  );
};

ReactDOM.render(<APP />, document.getElementById('app'));
