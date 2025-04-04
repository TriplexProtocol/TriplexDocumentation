/**
 * Triplex协议 - 交互式用户指南
 * 
 * 这个脚本提供了一个交互式的用户指南系统，帮助新用户了解Triplex协议的各个功能。
 * 使用方法：在需要的页面引入此脚本，然后初始化对应的指南。
 */

class TriplexGuide {
    constructor(options = {}) {
        this.options = Object.assign({
            startDelay: 1000,
            stepDuration: 5000,
            highlightClass: 'triplex-highlight',
            tooltipClass: 'triplex-tooltip',
            overlayClass: 'triplex-overlay',
            activeClass: 'triplex-active',
            showProgressBar: true,
            showSkipButton: true,
            showNextButton: true,
            onComplete: null,
            onSkip: null,
            onStep: null
        }, options);
        
        this.currentStep = 0;
        this.steps = [];
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;
        this.progressBar = null;
        this.timer = null;
        
        this.boundKeyHandler = this.handleKeyPress.bind(this);
    }
    
    /**
     * 添加指南步骤
     * @param {string|HTMLElement} selector - 元素选择器或DOM元素
     * @param {string} content - 提示文本内容
     * @param {string} position - 提示框位置 (top, right, bottom, left)
     * @param {Function} beforeShow - 显示前的回调函数
     * @param {Function} afterHide - 隐藏后的回调函数
     */
    addStep(selector, content, position = 'bottom', beforeShow = null, afterHide = null) {
        this.steps.push({
            selector: selector,
            content: content,
            position: position,
            beforeShow: beforeShow,
            afterHide: afterHide
        });
        return this;
    }
    
    /**
     * 启动指南
     */
    start() {
        if (this.steps.length === 0 || this.isActive) return;
        
        this.createOverlay();
        this.createTooltip();
        if (this.options.showProgressBar) this.createProgressBar();
        
        this.isActive = true;
        this.currentStep = 0;
        
        document.addEventListener('keydown', this.boundKeyHandler);
        
        setTimeout(() => {
            this.showStep(this.currentStep);
        }, this.options.startDelay);
        
        return this;
    }
    
    /**
     * 显示特定步骤
     * @param {number} index - 步骤索引
     */
    showStep(index) {
        if (index >= this.steps.length || !this.isActive) return;
        
        const step = this.steps[index];
        const element = typeof step.selector === 'string' 
            ? document.querySelector(step.selector) 
            : step.selector;
            
        if (!element) {
            console.warn(`Guide element not found: ${step.selector}`);
            this.nextStep();
            return;
        }
        
        if (step.beforeShow && typeof step.beforeShow === 'function') {
            step.beforeShow(element, index);
        }
        
        // 高亮目标元素
        this.highlightElement(element);
        
        // 更新并显示提示框
        this.updateTooltip(step.content, this.getTooltipPosition(element, step.position));
        
        // 更新进度条
        if (this.progressBar) {
            this.updateProgress((index + 1) / this.steps.length * 100);
        }
        
        // 触发步骤回调
        if (this.options.onStep && typeof this.options.onStep === 'function') {
            this.options.onStep(index, step);
        }
        
        // 设置自动前进定时器
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.nextStep();
        }, this.options.stepDuration);
    }
    
    /**
     * 前进到下一步
     */
    nextStep() {
        const currentStep = this.steps[this.currentStep];
        
        if (currentStep.afterHide && typeof currentStep.afterHide === 'function') {
            const element = typeof currentStep.selector === 'string' 
                ? document.querySelector(currentStep.selector) 
                : currentStep.selector;
                
            if (element) {
                currentStep.afterHide(element, this.currentStep);
            }
        }
        
        this.currentStep++;
        
        if (this.currentStep >= this.steps.length) {
            this.complete();
        } else {
            this.showStep(this.currentStep);
        }
    }
    
    /**
     * 返回上一步
     */
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }
    
    /**
     * 完成指南
     */
    complete() {
        this.cleanup();
        
        if (this.options.onComplete && typeof this.options.onComplete === 'function') {
            this.options.onComplete();
        }
        
        // 存储完成状态
        localStorage.setItem('triplexGuideCompleted', 'true');
    }
    
    /**
     * 跳过指南
     */
    skip() {
        this.cleanup();
        
        if (this.options.onSkip && typeof this.options.onSkip === 'function') {
            this.options.onSkip();
        }
        
        // 存储跳过状态
        localStorage.setItem('triplexGuideSkipped', 'true');
    }
    
    /**
     * 清理DOM元素和事件监听器
     */
    cleanup() {
        clearTimeout(this.timer);
        
        if (this.overlay) {
            document.body.removeChild(this.overlay);
            this.overlay = null;
        }
        
        if (this.tooltip) {
            document.body.removeChild(this.tooltip);
            this.tooltip = null;
        }
        
        if (this.progressBar) {
            document.body.removeChild(this.progressBar);
            this.progressBar = null;
        }
        
        document.removeEventListener('keydown', this.boundKeyHandler);
        
        // 移除所有高亮样式
        const highlightedElements = document.querySelectorAll(`.${this.options.highlightClass}`);
        highlightedElements.forEach(el => {
            el.classList.remove(this.options.highlightClass);
        });
        
        this.isActive = false;
    }
    
    /**
     * 创建覆盖层
     */
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = this.options.overlayClass;
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.overlay.style.zIndex = '9998';
        this.overlay.style.pointerEvents = 'none';
        
        document.body.appendChild(this.overlay);
    }
    
    /**
     * 创建提示框
     */
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = this.options.tooltipClass;
        this.tooltip.style.position = 'absolute';
        this.tooltip.style.backgroundColor = '#1a73e8';
        this.tooltip.style.color = 'white';
        this.tooltip.style.padding = '15px';
        this.tooltip.style.borderRadius = '8px';
        this.tooltip.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        this.tooltip.style.zIndex = '10000';
        this.tooltip.style.maxWidth = '300px';
        this.tooltip.style.display = 'none';
        
        // 添加按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '15px';
        
        // 添加上一步按钮
        const prevButton = document.createElement('button');
        prevButton.textContent = '上一步';
        prevButton.style.padding = '5px 10px';
        prevButton.style.backgroundColor = 'transparent';
        prevButton.style.border = '1px solid white';
        prevButton.style.color = 'white';
        prevButton.style.borderRadius = '4px';
        prevButton.style.cursor = 'pointer';
        prevButton.addEventListener('click', () => this.prevStep());
        
        // 添加下一步按钮
        const nextButton = document.createElement('button');
        nextButton.textContent = '下一步';
        nextButton.style.padding = '5px 10px';
        nextButton.style.backgroundColor = 'white';
        nextButton.style.border = 'none';
        nextButton.style.color = '#1a73e8';
        nextButton.style.borderRadius = '4px';
        nextButton.style.cursor = 'pointer';
        nextButton.addEventListener('click', () => this.nextStep());
        
        // 添加跳过按钮
        const skipButton = document.createElement('button');
        skipButton.textContent = '跳过';
        skipButton.style.padding = '5px 10px';
        skipButton.style.backgroundColor = 'transparent';
        skipButton.style.border = 'none';
        skipButton.style.color = 'white';
        skipButton.style.borderRadius = '4px';
        skipButton.style.cursor = 'pointer';
        skipButton.addEventListener('click', () => this.skip());
        
        // 将按钮添加到容器
        if (this.currentStep > 0) {
            buttonContainer.appendChild(prevButton);
        }
        
        if (this.options.showSkipButton) {
            buttonContainer.appendChild(skipButton);
        }
        
        if (this.options.showNextButton) {
            buttonContainer.appendChild(nextButton);
        }
        
        this.tooltip.appendChild(buttonContainer);
        document.body.appendChild(this.tooltip);
    }
    
    /**
     * 创建进度条
     */
    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.style.position = 'fixed';
        this.progressBar.style.top = '0';
        this.progressBar.style.left = '0';
        this.progressBar.style.width = '0%';
        this.progressBar.style.height = '3px';
        this.progressBar.style.backgroundColor = '#1a73e8';
        this.progressBar.style.zIndex = '10001';
        this.progressBar.style.transition = 'width 0.3s ease';
        
        document.body.appendChild(this.progressBar);
    }
    
    /**
     * 更新进度条
     * @param {number} percent - 完成百分比
     */
    updateProgress(percent) {
        if (this.progressBar) {
            this.progressBar.style.width = `${percent}%`;
        }
    }
    
    /**
     * 更新提示框内容和位置
     * @param {string} content - 提示文本
     * @param {Object} position - 位置坐标 {top, left}
     */
    updateTooltip(content, position) {
        // 更新内容
        this.tooltip.innerHTML = `<div>${content}</div>`;
        
        // 添加按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '15px';
        
        // 添加上一步按钮
        if (this.currentStep > 0) {
            const prevButton = document.createElement('button');
            prevButton.textContent = '上一步';
            prevButton.style.padding = '5px 10px';
            prevButton.style.backgroundColor = 'transparent';
            prevButton.style.border = '1px solid white';
            prevButton.style.color = 'white';
            prevButton.style.borderRadius = '4px';
            prevButton.style.cursor = 'pointer';
            prevButton.addEventListener('click', () => this.prevStep());
            buttonContainer.appendChild(prevButton);
        }
        
        // 添加跳过按钮
        if (this.options.showSkipButton) {
            const skipButton = document.createElement('button');
            skipButton.textContent = '跳过';
            skipButton.style.padding = '5px 10px';
            skipButton.style.backgroundColor = 'transparent';
            skipButton.style.border = 'none';
            skipButton.style.color = 'white';
            skipButton.style.borderRadius = '4px';
            skipButton.style.cursor = 'pointer';
            skipButton.addEventListener('click', () => this.skip());
            buttonContainer.appendChild(skipButton);
        }
        
        // 添加下一步按钮
        if (this.options.showNextButton) {
            const nextButton = document.createElement('button');
            nextButton.textContent = this.currentStep === this.steps.length - 1 ? '完成' : '下一步';
            nextButton.style.padding = '5px 10px';
            nextButton.style.backgroundColor = 'white';
            nextButton.style.border = 'none';
            nextButton.style.color = '#1a73e8';
            nextButton.style.borderRadius = '4px';
            nextButton.style.cursor = 'pointer';
            nextButton.addEventListener('click', () => this.nextStep());
            buttonContainer.appendChild(nextButton);
        }
        
        this.tooltip.appendChild(buttonContainer);
        
        // 更新位置
        this.tooltip.style.top = `${position.top}px`;
        this.tooltip.style.left = `${position.left}px`;
        
        // 显示提示框
        this.tooltip.style.display = 'block';
    }
    
    /**
     * 高亮目标元素
     * @param {HTMLElement} element - 目标DOM元素
     */
    highlightElement(element) {
        // 移除之前的高亮
        const highlightedElements = document.querySelectorAll(`.${this.options.highlightClass}`);
        highlightedElements.forEach(el => {
            el.classList.remove(this.options.highlightClass);
            el.classList.remove(this.options.activeClass);
        });
        
        // 添加新的高亮
        element.classList.add(this.options.highlightClass);
        element.classList.add(this.options.activeClass);
        
        // 确保元素可见
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // 根据元素位置更新覆盖层
        this.updateOverlay(element);
    }
    
    /**
     * 根据元素位置更新覆盖层
     * @param {HTMLElement} element - 目标DOM元素
     */
    updateOverlay(element) {
        const rect = element.getBoundingClientRect();
        
        // 创建遮罩孔
        const holeStyle = `
            radial-gradient(
                ellipse at ${rect.left + rect.width/2}px ${rect.top + rect.height/2}px,
                transparent 0,
                transparent ${Math.max(rect.width, rect.height) / 2}px,
                rgba(0, 0, 0, 0.5) ${Math.max(rect.width, rect.height) / 2 + 1}px
            )
        `;
        
        this.overlay.style.background = holeStyle;
        this.overlay.style.pointerEvents = 'all';
        
        // 更新点击事件，仅高亮元素可点击
        this.overlay.onclick = (e) => {
            const clickedElement = document.elementFromPoint(
                e.clientX,
                e.clientY
            );
            
            const isHighlightedElement = clickedElement === element || element.contains(clickedElement);
            
            if (!isHighlightedElement) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
    }
    
    /**
     * 计算提示框位置
     * @param {HTMLElement} element - 目标DOM元素
     * @param {string} position - 位置方向 (top, right, bottom, left)
     * @returns {Object} 位置坐标 {top, left}
     */
    getTooltipPosition(element, position) {
        const rect = element.getBoundingClientRect();
        const tooltipWidth = 300; // 最大宽度
        const tooltipHeight = 150; // 估计高度
        const margin = 15; // 与元素的间距
        
        let top, left;
        
        switch (position) {
            case 'top':
                top = rect.top - tooltipHeight - margin;
                left = rect.left + (rect.width - tooltipWidth) / 2;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipHeight) / 2;
                left = rect.right + margin;
                break;
            case 'bottom':
                top = rect.bottom + margin;
                left = rect.left + (rect.width - tooltipWidth) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipHeight) / 2;
                left = rect.left - tooltipWidth - margin;
                break;
            default:
                top = rect.bottom + margin;
                left = rect.left + (rect.width - tooltipWidth) / 2;
        }
        
        // 确保提示框不超出视口
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        if (left < 0) left = margin;
        if (left + tooltipWidth > windowWidth) left = windowWidth - tooltipWidth - margin;
        if (top < 0) top = margin;
        if (top + tooltipHeight > windowHeight) top = windowHeight - tooltipHeight - margin;
        
        return { top, left };
    }
    
    /**
     * 处理键盘事件
     * @param {KeyboardEvent} event - 键盘事件对象
     */
    handleKeyPress(event) {
        if (!this.isActive) return;
        
        switch (event.key) {
            case 'Escape':
                this.skip();
                break;
            case 'ArrowRight':
            case 'Enter':
                this.nextStep();
                break;
            case 'ArrowLeft':
                this.prevStep();
                break;
        }
    }
    
    /**
     * 检查是否已经完成或跳过指南
     * @returns {boolean} 是否应显示指南
     */
    shouldShow() {
        const completed = localStorage.getItem('triplexGuideCompleted') === 'true';
        const skipped = localStorage.getItem('triplexGuideSkipped') === 'true';
        return !completed && !skipped;
    }
    
    /**
     * 重置指南状态
     */
    resetState() {
        localStorage.removeItem('triplexGuideCompleted');
        localStorage.removeItem('triplexGuideSkipped');
        return this;
    }
}

/**
 * 预定义的指南配置
 */
const TriplexGuides = {
    // 首页指南
    home: function() {
        return new TriplexGuide()
            .addStep('.logo', '欢迎来到Triplex协议！这是去中心化合成资产的未来。', 'bottom')
            .addStep('.nav-links', '通过这些链接，您可以访问协议的所有主要功能。', 'bottom')
            .addStep('.wallet-button', '首先，您需要连接您的钱包以开始使用Triplex。', 'left')
            .addStep('.hero h1', 'Triplex让您可以创建和交易与现实世界资产挂钩的合成资产。', 'bottom')
            .addStep('.features', '探索我们的核心功能，了解Triplex如何改变DeFi生态。', 'top')
            .addStep('.stats-bar', '实时查看协议的关键指标和状态。', 'bottom')
            .addStep('.action-button.primary', '准备好了吗？点击这里开始您的Triplex之旅！', 'bottom');
    },
    
    // 抵押品管理指南
    collateral: function() {
        return new TriplexGuide()
            .addStep('.collateral-overview', '这里显示您当前的抵押品状况和健康因子。', 'bottom')
            .addStep('.deposit-card', '在这里存入新的抵押品，以铸造合成资产。', 'right')
            .addStep('.withdraw-card', '需要提取抵押品？在这里操作，但注意保持足够的抵押率。', 'left')
            .addStep('.health-factor', '健康因子是衡量您头寸安全性的关键指标，保持在安全线以上。', 'bottom')
            .addStep('.adjustment-card', '使用这个工具调整抵押率，优化您的资本效率。', 'top');
    },
    
    // 合成资产指南
    syntheticAssets: function() {
        return new TriplexGuide()
            .addStep('.assets-market', '这里列出了所有可用的合成资产，包括价格和总供应量。', 'bottom')
            .addStep('.asset-search', '使用搜索功能快速找到您感兴趣的资产。', 'bottom')
            .addStep('.asset-card', '点击任何资产卡片查看详情或开始铸造。', 'right')
            .addStep('.mint-button', '准备好后，点击铸造按钮创建您选择的合成资产。', 'left')
            .addStep('.risk-indicators', '始终关注风险指标，确保您的投资安全。', 'top');
    },
    
    // 流动性挖矿指南
    liquidityMining: function() {
        return new TriplexGuide()
            .addStep('.pools-overview', '这里显示所有可用的流动性池及其APY。', 'bottom')
            .addStep('.pool-card', '每个流动性池都有不同的收益结构和风险特征。', 'right')
            .addStep('.stake-section', '选择池子后，在这里质押您的资产开始赚取收益。', 'bottom')
            .addStep('.rewards-section', '在这里查看和领取您的挖矿奖励。', 'top')
            .addStep('.strategy-tips', '查看这些策略提示，优化您的挖矿收益。', 'left');
    },
    
    // 治理指南
    governance: function() {
        return new TriplexGuide()
            .addStep('.governance-stats', '这里展示了治理的关键指标，如总质押TPX和投票率。', 'bottom')
            .addStep('.proposals-list', '浏览当前活跃的和历史提案。', 'right')
            .addStep('.proposal-card', '点击任何提案查看详情并参与投票。', 'bottom')
            .addStep('.voting-section', '在这里为提案投票，您的投票权重取决于您质押的TPX数量。', 'top')
            .addStep('.create-proposal', '有改进想法？在这里创建新的提案。', 'left');
    },
    
    // 用户个人中心指南
    userProfile: function() {
        return new TriplexGuide()
            .addStep('.user-header', '这里显示您的账户信息和地址。', 'bottom')
            .addStep('.summary-cards', '一目了然地查看您的资产总值和关键指标。', 'bottom')
            .addStep('.portfolio-grid', '这里详细列出了您的所有资产，包括余额和状态。', 'right')
            .addStep('.transaction-history', '查看您的所有交易历史记录。', 'top')
            .addStep('.active-positions', '这里显示您当前的借贷头寸和风险状态。', 'bottom');
    }
};

// 导出
window.TriplexGuide = TriplexGuide;
window.TriplexGuides = TriplexGuides; 