# 访存指令

## 加载

```asm
ld.w  rd, rj, imm  # rd = mem[ rj + imm ]  (32-bit)
ld.b  rd, rj, imm  # 按字节加载并符号扩展
```

## 存储

```asm
st.w  rd, rj, imm  # mem[ rj + imm ] = rd
st.b  rd, rj, imm  # 按字节存储
```
