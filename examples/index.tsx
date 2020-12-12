import React, {FC} from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line no-restricted-imports
import {Bezier} from '../src/library';

const APP: FC = () => <Bezier />;

ReactDOM.render(<APP />, document.getElementById('app'));
