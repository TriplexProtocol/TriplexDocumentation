/* eslint-env node */
import { SwrIcon, VercelIcon } from '@app/_icons'
import type { Metadata } from 'next'
import {
  Footer,
  LastUpdated,
  Layout,
  Link,
  LocaleSwitch,
  Navbar
} from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import { pageMap as graphqlEslintPageMap } from './graphql-eslint/[[...slug]]/page'
import { pageMap as graphqlYogaPageMap } from './remote/graphql-yoga/[[...slug]]/page'
import './styles.css'

export const metadata: Metadata = {
  description:
    'Triplex是建立在Aptos上的去中心化流动性提供协议，提供模块化架构和灵活的流动性提供系统。',
  title: {
    absolute: '',
    template: '%s | Triplex'
  },
  metadataBase: new URL('https://triplex.fi'),
  openGraph: {
    images:
      'https://assets.vercel.com/image/upload/v1572282926/swr/twitter-card.jpg'
  },
  twitter: {
    site: '@triplex_io'
  },
  appleWebApp: {
    title: 'Triplex'
  },
  other: {
    'msapplication-TileColor': '#fff'
  }
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  let pageMap = await getPageMap(`/${lang}`)

  if (lang === 'en') {
    pageMap = [
      ...pageMap,
      {
        name: 'remote',
        route: '/remote',
        children: [graphqlYogaPageMap],
        title: 'Remote'
      },
      graphqlEslintPageMap
    ]
  }
  const banner = (
    <Banner storageKey="triplex-launch">
      Triplex-- GZ & Phili & Alex_yue      "2025 APTOS EVERMOVE Hacker House" Project 
    </Banner>
  )
  const navbar = (
    <Navbar
      logo={
        <>
          <SwrIcon height="12" />
          <span
            className="ms-2 font-extrabold select-none max-md:hidden"
            title={`Triplex: ${dictionary.logo.title}`}
          >
            Triplex
          </span>
        </>
      }
      projectLink="https://github.com/triplexlabs/triplex"
      chatLink="https://discord.gg/triplex"
    >
      <LocaleSwitch lite />
    </Navbar>
  )
  const footer = (
    <Footer>
      <a
        rel="noreferrer"
        target="_blank"
        className="x:focus-visible:nextra-focus flex items-center gap-2 font-semibold"
        href={dictionary.link.vercel}
      >
        {dictionary.poweredBy} <VercelIcon height="20" />
      </a>
    </Footer>
  )
  return (
    <html lang={lang} dir={getDirection(lang)} suppressHydrationWarning>
      <Head
        backgroundColor={{
          dark: 'rgb(15,23,42)',
          light: 'rgb(254, 252, 232)'
        }}
        color={{
          hue: { dark: 120, light: 0 },
          saturation: { dark: 100, light: 100 }
        }}
      />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          footer={footer}
          docsRepositoryBase="https://github.com/shuding/nextra/blob/main/examples/swr-site"
          i18n={[
            { locale: 'en', name: 'English' },
            { locale: 'zh-SG', name: '简体中文' }
          ]}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            autoCollapse: true
          }}
          toc={{
            backToTop: dictionary.backToTop
          }}
          editLink={dictionary.editPage}
          pageMap={pageMap}
          nextThemes={{ defaultTheme: 'dark' }}
          lastUpdated={<LastUpdated>{dictionary.lastUpdated}</LastUpdated>}
          themeSwitch={{
            dark: dictionary.dark,
            light: dictionary.light,
            system: dictionary.system
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
