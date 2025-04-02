# SWR Documentation Site

This is the official documentation site for SWR, built with Next.js and Nextra.

## Documentation

Visit https://swr.vercel.app to view the online documentation.

## Development

### Installation

This project uses [PNPM](https://pnpm.io/) as its package manager.

1. Run `corepack enable` to enable Corepack.

   > If the command above fails, run `npm install -g corepack@latest` to install
   > the latest version of
   > [Corepack](https://github.com/nodejs/corepack?tab=readme-ov-file#manual-installs).

2. Run `pnpm install` to install the project dependencies.

### Running the Development Server

```bash
pnpm dev
```

### Building the Site

```bash
pnpm build
```

Start in production mode:

```bash
pnpm start
```

### Other Commands

- Type checking: `pnpm types:check`
- Build analysis: `pnpm analyze`

