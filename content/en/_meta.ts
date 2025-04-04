export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      typesetting: 'article',
      toc: false
    }
  },
  architecturalanalysis: {
    type: 'page',
    title: 'Triplex Architecture Analysis'
  },
  TriplexProtocol: {
    type: 'page',
    title: 'Triplex Protocol Analysis'
  },
  perpsDoc: {
    title: 'Perpetual Protocol',
    type: 'menu',
    items: {
      overview: {
        title: 'Overview'
      },
      mechanism: {
        title: 'Protocol Mechanism'
      },
      risk: {
        title: 'Risk Management'
      }
    }
  },
  fordevelopers: {
    title: 'For Developers',
    type: 'menu',
    items: {
      overview: {
        title: 'Overview'
      },
      integration: {
        title: 'Integration Guide'
      },
      api: {
        title: 'API Reference'
      }
    }
  }
}
