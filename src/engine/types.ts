/**
 * 配置驱动的实验引擎数据模型。
 *
 * 引擎核心 (engine/) 为纯 TypeScript，不依赖 Vue，便于 Vitest 单元测试。
 * 添加新实验 = 新增一个 ExperimentModule 配置文件，无需改动 UI 或路由。
 */

/** 一个学生记录的数值输入项。 */
export interface InputField {
  /** 稳定标识，供公式引用，如 'm1' */
  id: string
  /** 中文标签，如 '器皿 + 镁 质量 (m1)' */
  label: string
  /** 单位，如 'g'、'mL'、'kPa'；无单位可省略 */
  unit?: string
  type: 'number'
  /** 预填充值；缺省则留空 */
  default?: number
  /** 输入步长 */
  step?: number
  /** 占位提示 */
  placeholder?: string
  /** 输入框硬性最小值 */
  min?: number
  /** 输入框硬性最大值 */
  max?: number
  /** 用于数据校验反馈的合理区间（软性，超出仅提示不拦截） */
  range?: { min: number; max: number }
  /** 字段下的简短提示 */
  hint?: string
  /** 可选分组名，用于在表单中渲染分组小标题（如 'common'、'A'、'B'）；缺省则不分组 */
  group?: string
  /** 分组小标题的真人可读名称（如 '硫酸亚铁制备'）；缺省时按 group 映射为 '共享参数'/'第 X 份' */
  groupLabel?: string
}

/**
 * 求值上下文，交给每个 derived 表达式与校验规则的只读对象。
 */
export interface EvalContext {
  /** 学生输入的合法数值（仅有限数） */
  inputs: Record<string, number>
  /** 已计算出的推导值，按依赖顺序逐个填充 */
  derived: Record<string, number>
  /** 模块常量 */
  constants: Record<string, number>
  /** 参考查表，如水的饱和蒸气压表 */
  tables: Record<string, LookupTable>
  /** 常用辅助函数 */
  helpers: EngineHelpers
}

/** 一个推导值：由 id + 纯函数表达，数组顺序即依赖顺序。 */
export interface DerivedField<T = number> {
  id: string
  label: string
  expression: (ctx: EvalContext) => T
}

/** 最终展示的结果字段（引用某个 derived id），带显示格式。 */
export interface ResultField {
  id: string
  label: string
  unit?: string
  /** 固定小数位 */
  dp?: number
  /** 有效数字位数（与 dp 二选一） */
  sigFigs?: number
  kind?: 'value' | 'percentage' | 'mass' | 'dimensionless'
}

/** 校验 / 反馈规则，产出可读消息。 */
export interface ValidationRule {
  id: string
  /** severity 驱动颜色编码 */
  severity: 'error' | 'warning' | 'info'
  check: (ctx: EvalContext) => { ok: boolean; message?: string }
  /** 即使通过也始终显示（如理论值对比信息） */
  alwaysShow?: boolean
}

/** 参考查表（目前支持水的饱和蒸气压）。 */
export interface LookupTable {
  kind: 'vapor-pressure-water'
  unit: 'kPa' | 'mmHg'
  /** 单调递增的 [T_degC, P] 序列 */
  points: Array<[number, number]>
}

/** 引擎辅助函数。 */
export interface EngineHelpers {
  /** 在查表上按温度做线性插值 */
  interp: (table: LookupTable, x: number) => number
}

/** 一个完整实验模块的声明。 */
export interface ExperimentModule {
  id: string
  /** 所属学科 category id（参见 src/lib/categories.ts），如 'inorganic' */
  category?: string
  title: string
  objective: string
  /** 简短实验流程说明（纯文本即可，逐行显示） */
  brief?: string
  prerequisite?: string
  meta?: {
    theoretical?: Record<string, number>
    references?: Record<string, string>
  }
  constants: Record<string, number>
  tables?: Record<string, LookupTable>
  inputs: InputField[]
  /** 顺序即依赖顺序 */
  derived: DerivedField[]
  /** 需要作为"结果"高亮展示的 derived id */
  results: ResultField[]
  validations: ValidationRule[]
  units?: {
    pressure: 'kPa' | 'mmHg'
    volume: 'mL'
    temperature: '°C'
    mass: 'g'
  }
}

/** 一次求值输出的结构。 */
export interface ValidationMessage {
  ruleId: string
  severity: 'error' | 'warning' | 'info'
  message: string
}

export interface DisplayValue {
  value: number
  display: string
}

export interface EngineOutput {
  derived: Record<string, number>
  results: Record<string, DisplayValue>
  validations: ValidationMessage[]
  constants: Record<string, number>
}
