import meta from '../en/_meta'

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
    title: 'Triplex架构分析'
  },
  TriplexProtocol: {
    type: 'page',
    title: 'Triplex协议分析'
  },
  perpsDoc: {
    title: '永续合约协议',
    type: 'menu',
    items: {
      overview: {
        title: '概览'
      },
      mechanism: {
        title: '协议机制'
      },
      risk: {
        title: '风险管理'
      }
    }
  },
  fordevelopers: {
    title: '开发者文档',
    type: 'menu',
    items: {
      overview: {
        title: '概览'
      },
      integration: {
        title: '集成指南'
      },
      api: {
        title: 'API参考'
      }
    }
  }
} 