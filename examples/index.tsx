import React, {FC, Fragment} from 'react';
import ReactDOM from 'react-dom';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {escape} from 'lodash-es';

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
      <Tabs
        defaultIndex={location.hash ? +location.hash[1] : 0}
        onSelect={index => {
          location.hash = index.toString();
        }}
      >
        <TabList>
          <Tab>Basic</Tab>
          <Tab>Placement</Tab>
          <Tab>Stroke</Tab>
          <Tab>Mark</Tab>
          <Tab>Event</Tab>
          <Tab>API</Tab>
          <Tab
            onClickCapture={() => {
              location.href = 'https://github.com/boenfu/rc-bezier';
            }}
          >
            Github
            <img
              style={{
                marginLeft: 12,
              }}
              alt="GitHub Repo stars"
              src="https://img.shields.io/github/stars/boenfu/rc-bezier?style=social"
            ></img>
          </Tab>
        </TabList>

        <TabPanel>
          <pre
            data-index="#1 basic usage"
            dangerouslySetInnerHTML={{
              __html: escape(
                `
<div className="block">block 1</div>
<Bezier />
<div className="block">block 2</div>
`,
              ),
            }}
          />

          <div className="father">
            <div className="block" style={{top: 300, left: 200}}>
              block 1
            </div>
            <Bezier />
            <div className="block" style={{top: 520, left: 480}}>
              block 2
            </div>
          </div>

          <pre
            data-index="#2 rect control"
            dangerouslySetInnerHTML={{
              __html: escape(
                `
<div className="block" style={{top: 1100, left: 200}}>block 1</div>
<div style={{backgroundColor: 'blueviolet'}}>
<Bezier
  rect={{width: 200, height: 200}}
  startNode={['parent', 'previousSibling']}
  endNode={['parent', 'nextSibling']}
/>
</div>
<div className="block" style={{top: 1300, left: 480}}>block 2</div>
`,
              ),
            }}
          />

          <div className="father">
            <div className="block" style={{top: 1100, left: 200}}>
              block 1
            </div>
            <div style={{backgroundColor: 'blueviolet'}}>
              <Bezier
                rect={{width: 200, height: 200}}
                startNode={['parent', 'previousSibling']}
                endNode={['parent', 'nextSibling']}
              />
            </div>
            <div className="block" style={{top: 1500, left: 480}}>
              block 2
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <pre
            data-index="#1 custom placement"
            dangerouslySetInnerHTML={{
              __html: escape(
                `
<div className="block">block 1</div>
<Bezier placement={{start: 'right-bottom', end: 'left-top'}} />
<div className="block">block 2</div>
`,
              ),
            }}
          />

          <div className="father">
            <div className="block" style={{top: 327, left: 180}}>
              block 1
            </div>
            <Bezier placement={{start: 'right-bottom', end: 'left-top'}} />
            <div className="block" style={{top: 435, left: 582}}>
              block 2
            </div>
          </div>

          <pre
            data-index="#2 placement offset"
            dangerouslySetInnerHTML={{
              __html: escape(
                `
<div className="block">block 1</div>
<Bezier
  placement={{
    start: 'top-left',
    end: 'left-top',
    startOffset: 24,
    endOffset: 36,
  }}
/>
<div className="block">block 2</div>
`,
              ),
            }}
          />

          <div className="father">
            <div className="block" style={{top: 1368, left: 180}}>
              block 1
            </div>
            <Bezier
              placement={{
                start: 'top-left',
                end: 'left-top',
                startOffset: 24,
                endOffset: 36,
              }}
            />
            <div className="block" style={{top: 1174, left: 582}}>
              block 2
            </div>
          </div>

          <pre
            data-index="#3 startNode & endNode"
            dangerouslySetInnerHTML={{
              __html: escape(
                `
<div className="block">block 1</div>
<Bezier
  placement={{start: 'bottom', end: 'top'}}
  startNode="previousSibling"
  endNode="nextSibling"
/>
<div className="block">block 2</div>
<Bezier placement={{start: 'right', end: 'bottom'}} />
<div className="block">block 3</div>
<Bezier
  placement={{start: 'top', end: 'right'}}
  endNode={ele => ele.parentElement.firstElementChild}
/>
`,
              ),
            }}
          />

          <div className="father">
            <div className="block" style={{top: 2000, left: 180}}>
              block 1
            </div>
            <Bezier
              placement={{start: 'bottom', end: 'top'}}
              startNode="previousSibling"
              endNode="nextSibling"
            />
            <div className="block" style={{top: 2200, left: 220}}>
              block 2
            </div>
            <Bezier placement={{start: 'right', end: 'bottom'}} />
            <div className="block" style={{top: 2100, left: 580}}>
              block 3
            </div>
            <Bezier
              placement={{start: 'top', end: 'right'}}
              endNode={ele => ele.parentElement?.firstElementChild!}
            />
          </div>

          <pre
            data-index="#4 turningPoint & indent"
            dangerouslySetInnerHTML={{
              __html: escape(
                `
<div className="father">
  {Array(3)
  .fill(undefined)
  .map((_, index) => {
    return (
      <Fragment key={index}>
        <div className="block">block {index + 1}</div>
        <Bezier
          placement={{
            start: 'top',
            end: 'top',
            turningPoint: 0,
            startIndent: -60,
          }}
          startNode="parent"
          endNode="previousSibling"
        />
      </Fragment>
    );
  })}
</div>
`,
              ),
            }}
          />
          <div className="father">
            {Array(3)
              .fill(undefined)
              .map((_, index) => {
                return (
                  <Fragment key={index}>
                    <div
                      className="block"
                      style={{
                        top: 3050 + 120 * index,
                        left: 160 + 200 * index,
                      }}
                    >
                      block {index + 1}
                    </div>
                    <Bezier
                      placement={{
                        start: 'top',
                        end: 'top',
                        turningPoint: 0,
                        startIndent: -60,
                      }}
                      startNode="parent"
                      endNode="previousSibling"
                    />
                  </Fragment>
                );
              })}
          </div>
        </TabPanel>
        <TabPanel>
          <pre
            data-index="#1 color"
            dangerouslySetInnerHTML={{
              __html: escape(
                `
<div className="block">block 1</div>
<Bezier stroke={{color: "red"}} />
<div className="block">block 2</div>
`,
              ),
            }}
          />

          <div className="father">
            <div className="block" style={{top: 300, left: 200}}>
              block 1
            </div>
            <Bezier stroke={{color: 'red'}} />
            <div className="block" style={{top: 520, left: 480}}>
              block 2
            </div>
          </div>

          <pre
            data-index="#2 width"
            dangerouslySetInnerHTML={{
              __html: escape(
                `
<div className="block">block 1</div>
<Bezier stroke={{width: 10}} />
<div className="block">block 2</div>
`,
              ),
            }}
          />

          <div className="father">
            <div className="block" style={{top: 960, left: 200}}>
              block 1
            </div>
            <Bezier stroke={{width: 10}} />
            <div className="block" style={{top: 1180, left: 480}}>
              block 2
            </div>
          </div>

          <pre
            data-index="#3 dasharray"
            dangerouslySetInnerHTML={{
              __html: escape(
                `
<div className="block">block 1</div>
<Bezier stroke={{dasharray: 4}} />
<div className="block">block 2</div>
`,
              ),
            }}
          />

          <div className="father">
            <div className="block" style={{top: 1640, left: 200}}>
              block 1
            </div>
            <Bezier stroke={{dasharray: 4}} />
            <div className="block" style={{top: 1900, left: 480}}>
              block 2
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <pre data-index="#1 WIP" />
        </TabPanel>
        <TabPanel>
          <pre data-index="#1 WIP" />
        </TabPanel>
        <TabPanel>
          <iframe
            style={{
              width: '100vw',
              height: '100vh',
            }}
            src="./docs/index.html"
            frameBorder="0"
          ></iframe>
        </TabPanel>
        <TabPanel></TabPanel>
      </Tabs>
    </Fragment>
  );
};

ReactDOM.render(<APP />, document.getElementById('app'));
