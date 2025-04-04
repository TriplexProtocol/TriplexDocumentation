# Sui Move 开发环境设置指南

本文档详细记录了如何在macOS上设置完整的Sui Move开发环境，包括命令行工具和IDE扩展的安装与配置。

## 1. 安装基础依赖

### 1.1 安装Rust

Sui Move工具链基于Rust，首先需要安装Rust：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

选择默认安装选项（1），完成安装后重新启动终端或运行：

```bash
source "$HOME/.cargo/env"
```

验证安装：

```bash
rustc --version
cargo --version
```

### 1.2 安装Sui CLI

安装Sui命令行工具：

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui
```

验证安装：

```bash
sui --version
```

## 2. 安装Move语言分析器

Move语言分析器(move-analyzer)是为Move语言提供IDE支持的工具：

```bash
cargo install --git https://github.com/move-language/move move-analyzer
```

验证安装：

```bash
which move-analyzer
# 应该输出类似 /Users/username/.cargo/bin/move-analyzer
```

## 3. VSCode扩展安装

### 3.1 在标准VSCode中安装扩展

在标准VSCode中，可以通过扩展市场直接安装以下扩展：

1. **Move Analyzer** (`move.move-analyzer`) - 基础Move语言支持
2. **Sui Move Analyzer** (`movebit.sui-move-analyzer`) - Sui特定的Move语言支持
3. **Move Syntax** (`damirka.move-syntax`) - 语法高亮支持
4. **Move MSL Syntax** (`movebit.move-msl-syx`) - MSL语法支持

### 3.2 在Windsurf中安装Sui Move扩展

由于Windsurf可能无法直接从扩展市场安装某些扩展，我们可以从标准VSCode复制已安装的扩展：

1. 确认VSCode中已安装的扩展路径：

```bash
find ~/.vscode/extensions -name "*movebit*" -type d
# 找到类似 /Users/username/.vscode/extensions/movebit.sui-move-analyzer-1.1.6
```

2. 复制扩展到Windsurf扩展目录：

```bash
cp -r /Users/username/.vscode/extensions/movebit.sui-move-analyzer-[版本号] ~/.windsurf/extensions/
```

3. 完全退出并重启Windsurf

4. 配置扩展：
   - 打开设置 (Cmd+,)
   - 搜索 "move-analyzer"
   - 确保 "Move Language Server: Server Path" 设置为 move-analyzer 的完整路径
   - 例如：`/Users/username/.cargo/bin/move-analyzer`

## 4. 创建Sui Move项目

### 4.1 创建新项目

```bash
sui move new project_name
```

这将创建一个包含以下结构的项目：
- `Move.toml` - 项目配置文件
- `sources/` - 源代码目录
- `tests/` - 测试目录

### 4.2 项目结构示例

```
project_name/
├── Move.toml       # 项目配置文件
├── sources/        # 源代码目录
│   └── project_name.move  # 默认模块文件
└── tests/          # 测试目录
```

### 4.3 修改 Move.toml

确保`Move.toml`中的地址配置正确：

```toml
[addresses]
project_name = "0x0"  # 开发时使用的占位地址
```

## 5. 编写Sui Move代码

### 5.1 基本代码结构

下面是一个简单的Sui Move模块示例：

```move
module project_name::hello_world {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};

    // 公开的结构体，包含key和store能力
    public struct HelloWorldObject has key, store {
        id: UID,
        message: String
    }

    // 创建新对象的入口函数
    public entry fun create(message: String, ctx: &mut TxContext) {
        let object = HelloWorldObject {
            id: object::new(ctx),
            message
        };
        
        transfer::public_transfer(object, tx_context::sender(ctx));
    }

    // 获取消息的访问器函数
    public fun get_message(hello_obj: &HelloWorldObject): &String {
        &hello_obj.message
    }
}
```

### 5.2 注意事项

1. 模块名称必须与包名匹配(如`project_name::module_name`)
2. 公开结构体必须使用`public`修饰符
3. Sui Move 2024版本有更严格的可见性规则
4. 使用`entry`关键字标记可通过交易调用的入口函数

## 6. 编译和测试

### 6.1 编译项目

```bash
cd project_name
sui move build
```

### 6.2 运行测试

```bash
sui move test
```

### 6.3 发布智能合约

```bash
sui client publish --gas-budget 100000000
```

## 7. 常见问题与解决方案

### 7.1 语法高亮问题

如果IDE中没有语法高亮：
- 确保已安装所有必需的扩展
- 重启IDE
- 手动将文件关联设置为Move语言

### 7.2 编译错误

- **模块名称不匹配**: 确保模块名称与`Move.toml`中定义的包名一致
- **缺少可见性标注**: 确保结构体有可见性标注(如`public`)
- **未定义类型**: 使用`String`时需要导入`std::string::String`

### 7.3 IDE集成问题

如果IDE扩展不工作：
1. 检查move-analyzer路径配置
2. 在命令行中验证move-analyzer是否正常工作
3. 考虑重新安装扩展或使用标准VSCode进行开发

## 8. 资源与参考

- [Sui官方文档](https://docs.sui.io/)
- [Move语言参考](https://github.com/move-language/move/blob/main/language/documentation/book/src/SUMMARY.md)
- [Sui Move编码规范](https://docs.sui.io/concepts/sui-move-concepts/conventions)
