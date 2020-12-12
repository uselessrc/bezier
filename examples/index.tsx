import React, {CSSProperties, FC, Fragment, useEffect, useState} from 'react';
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

    Object.assign<CSSStyleDeclaration, Partial<CSSStyleDeclaration>>(
      ele.style,
      {
        position: 'absolute',
        left: `${e.clientX - x}px`,
        top: `${e.clientY - y}px`,
      },
    );
  });

  useDocumentEvent('mouseup', () => setMoving(false));

  return (
    <Fragment>
      <div className="block">block 1</div>
      <Bezier />
      <div className="block">block 2</div>
    </Fragment>
  );
};

ReactDOM.render(<APP />, document.getElementById('app'));
