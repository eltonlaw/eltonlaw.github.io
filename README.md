# eltonlaw.github.io

## Setup

```
sudo pacman -S yarn
```

## Dev

Build nextjs app as static website and deploy built `out/` dir to branch `gh-pages`
```
yarn build
yarn deploy
```

## Deploy

Statically render components and put outputs in `gh-pages` branch, GitHub pages is configured to use that branch.

```
yarn build
yarn deploy
```
