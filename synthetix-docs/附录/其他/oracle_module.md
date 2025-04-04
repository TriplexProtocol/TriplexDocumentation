# Oracle管理器模块 (OracleManager)

## 模块概述

Oracle管理器负责提供可靠的价格数据给Synthetix协议的各个组件。它支持多种价格数据源和处理机制，允许系统获取资产的实时价格并进行各种计算。Oracle系统是协议安全和稳定性的关键组件。

## 主要功能

1. **价格节点管理**
   - 注册价格节点
   - 配置节点属性
   - 管理节点层次结构

2. **价格数据获取**
   - 获取资产价格
   - 更新价格数据
   - 处理价格输入

3. **价格聚合**
   - 支持多种聚合方法(中位数、平均值等)
   - 过滤异常价格
   - 确保价格稳定性

## 接口定义

```solidity
interface IOracleManager {
    // 价格获取函数
    function getPrice(bytes32 nodeId) external view returns (int256 price);
    function process(bytes32 nodeId, bytes[] memory data) external returns (int256 price);
    
    // 节点管理函数
    function registerNode(Node.Data memory node) external returns (bytes32 nodeId);
    function getRoundData(bytes32 nodeId, uint256 roundId) external view returns (Round.Data memory roundData);
    function getLatestRoundId(bytes32 nodeId) external view returns (uint256 latestRoundId);
    
    // 节点查询
    function getNode(bytes32 nodeId) external view returns (Node.Data memory node);
    function getLastUpdatedTime(bytes32 nodeId) external view returns (uint64 lastUpdatedTime);
}
```

## 接口函数解释

- **getPrice**: 返回指定节点ID的最新价格
- **process**: 处理输入数据并更新特定节点的价格
- **registerNode**: 向Oracle系统注册新节点并返回其ID
- **getRoundData**: 检索特定轮次的历史价格数据
- **getLatestRoundId**: 返回节点的最新轮次ID
- **getNode**: 返回节点配置数据
- **getLastUpdatedTime**: 返回节点价格的最后更新时间

## 数据结构

```solidity
// 节点类型枚举
enum NodeType {
    TERMINAL,   // 终端节点，直接提供价格
    REDUCER,    // 聚合节点，处理多个输入
    EXTERNAL    // 外部数据源节点
}

// 聚合类型枚举
enum ReducerType {
    MEDIAN,  // 中位数聚合
    MEAN,    // 平均值聚合
    MINIMUM, // 最小值聚合
    MAXIMUM  // 最大值聚合
}

// 节点数据结构
struct Node {
    NodeType nodeType;
    bytes32[] parents;
    bytes parameters;  // 根据节点类型解释的参数
}

// 轮次数据结构
struct Round {
    int256 price;
    uint64 timestamp;
    bytes32 nodeId;
}
```

## 事件

```solidity
// 节点事件
event NodeRegistered(bytes32 indexed nodeId, NodeType nodeType, bytes32[] parents, bytes parameters);
event PriceUpdated(bytes32 indexed nodeId, int256 price, uint256 roundId, uint64 timestamp);
```

## Move语言实现考虑

### 资源定义

```move
// 节点类型
struct NodeType has drop, copy, store {
    value: u8  // 0 = TERMINAL, 1 = REDUCER, 2 = EXTERNAL
}

// 聚合类型
struct ReducerType has drop, copy, store {
    value: u8  // 0 = MEDIAN, 1 = MEAN, 2 = MINIMUM, 3 = MAXIMUM
}

// 节点数据
struct Node has key, store {
    node_type: NodeType,
    parents: vector<vector<u8>>, // bytes32数组
    parameters: vector<u8>,      // 自定义参数
}

// 轮次数据
struct Round has key, store {
    price: I256,          // 有符号整数价格
    timestamp: u64,
    node_id: vector<u8>,  // bytes32
}

// Oracle存储
struct OracleStore has key {
    nodes: Table<vector<u8>, Node>,            // nodeId => Node
    rounds: Table<(vector<u8>, u256), Round>,  // (nodeId, roundId) => Round
    latest_rounds: Table<vector<u8>, u256>,    // nodeId => latestRoundId
}
```

### 主要函数

```move
public fun get_price(
    node_id: vector<u8>
): I256;

public fun process(
    node_id: vector<u8>,
    data: vector<vector<u8>>
): I256;

public fun register_node(
    node_type: NodeType,
    parents: vector<vector<u8>>,
    parameters: vector<u8>,
    admin_cap: &AdminCapability
): vector<u8>; // 返回nodeId

public fun get_round_data(
    node_id: vector<u8>,
    round_id: u256
): Round;

public fun get_latest_round_id(
    node_id: vector<u8>
): u256;
```

### 价格处理逻辑

在Move中，需要为不同类型的节点实现不同的价格处理逻辑：

```move
// 处理价格数据
fun process_price_data(
    node_id: vector<u8>,
    data: vector<vector<u8>>
): I256 {
    // 获取节点
    let node = get_node(node_id);
    
    // 根据节点类型分派处理
    if (node.node_type.value == 0) { // TERMINAL
        process_terminal_node(node_id, data)
    } else if (node.node_type.value == 1) { // REDUCER
        process_reducer_node(node_id, node.parents, node.parameters)
    } else { // EXTERNAL
        process_external_node(node_id, data)
    }
}

// 处理聚合节点
fun process_reducer_node(
    node_id: vector<u8>,
    parents: vector<vector<u8>>,
    parameters: vector<u8>
): I256 {
    // 解析参数获取聚合类型
    let reducer_type = parse_reducer_type(parameters);
    
    // 获取所有父节点价格
    let prices = vector<I256>[];
    let len = length(&parents);
    for (i in 0..len) {
        let parent_id = *vector::borrow(&parents, i);
        let price = get_price(parent_id);
        vector::push_back(&mut prices, price);
    }
    
    // 根据聚合类型处理价格
    if (reducer_type.value == 0) { // MEDIAN
        calculate_median(prices)
    } else if (reducer_type.value == 1) { // MEAN
        calculate_mean(prices)
    } else if (reducer_type.value == 2) { // MINIMUM
        calculate_min(prices)
    } else { // MAXIMUM
        calculate_max(prices)
    }
}
```

### 事件实现

```move
struct NodeRegisteredEvent has drop, store {
    node_id: vector<u8>,
    node_type: u8,
    parents: vector<vector<u8>>,
    parameters: vector<u8>,
}

struct PriceUpdatedEvent has drop, store {
    node_id: vector<u8>,
    price: I256,
    round_id: u256,
    timestamp: u64,
}

public fun emit_node_registered_event(
    node_id: vector<u8>,
    node_type: NodeType,
    parents: vector<vector<u8>>,
    parameters: vector<u8>
) {
    event::emit(NodeRegisteredEvent {
        node_id,
        node_type: node_type.value,
        parents,
        parameters,
    });
}
``` 