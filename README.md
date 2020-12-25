<p align="center"><img width="140" src="https://avatars3.githubusercontent.com/u/76463130?s=200&v=4"></p>
<p align="center">
  <a href="#"><img alt="npm" src="https://img.shields.io/npm/v/rc-bezier?style=flat-square"></a>
    <a href="#"><img alt="npm" src="https://img.shields.io/npm/dt/rc-bezier?style=flat-square"></a>
  <a href="#"><img alt="NPM" src="https://img.shields.io/npm/l/rc-bezier?style=flat-square"></a>
  <a href="#"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/uselessrc/bezier?style=flat-square"></a>
  <a href="http://makeapullrequest.com"><img alt="PRS" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square"></a>
</p>

<h2 align="center">rc-bezier</h2>
<p align="center"><b>🧷 React bezier component</b></p>

## Install

```shell
npm install rc-bezier --save
# or
yarn add rc-bezier
```

## Basic

```javascript
import {Bezier} from 'rc-bezier';

ReactDOM.render(
  <>
    <div className="block">block 1</div>
    <Bezier />
    <div className="block">block 2</div>
  </>,
  mountNode,
);
```

It will automatically generate a curve between the two blocks

![bezier.png](https://i.loli.net/2020/12/23/uz2hNo4eFCRtpYw.png)

## Examples & Documentation

[→ click to site](https://uselessrc.github.io/bezier)

[→ props types file](https://github.com/uselessrc/bezier/blob/main/src/library/bezier.doc.tsx#L3)

## Authors

- [boen](https://github.com/boenfu)

## License

- [MIT](https://opensource.org/licenses/MIT)
