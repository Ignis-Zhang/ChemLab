# 算数指令

## add 与 sub

```asm
add.w rd, rj, rk   # rd = rj + rk
sub.w rd, rj, rk   # rd = rj - rk
```

## 立即数运算

```asm
addi.w rd, rj, imm # rd = rj + sign_ext(imm)
lu12i.w rd, imm20  # rd = imm20 << 12
```
