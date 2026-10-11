# 实验 1 - 环境搭建

## 实验目的

1. 熟悉 Linux 开发环境的搭建
2. 掌握交叉编译工具链的使用
3. 学会使用模拟器运行 RISC-V 程序

## 实验内容

安装必要的工具：

```bash
sudo apt install gcc-riscv64-linux-gnu
sudo apt install qemu-user
```

## 检查与提交

编写一个 Hello World 程序并运行：

```c
#include <stdio.h>
int main() {
    printf("Hello, COD!\n");
    return 0;
}
```

编译并运行：

```bash
riscv64-linux-gnu-gcc -static -o hello hello.c
qemu-riscv64 ./hello
```
