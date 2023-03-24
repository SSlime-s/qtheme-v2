// ref: https://github.com/cloydlau/webgl-fluid

interface Options {
  /**
   * @default true
   */
  IMMEDIATE: boolean
  /**
   * @default 'hover'
   * Can be change to 'click'
   */
  TRIGGER: 'hover' | 'click'
  /**
   * @default 128
   */
  SIM_RESOLUTION: number
  /**
   * @default 1024
   */
  DYE_RESOLUTION: number
  /**
   * @default 512
   */
  CAPTURE_RESOLUTION: number
  /**
   * @default 1
   */
  DENSITY_DISSIPATION: number
  /**
   * @default 0.3
   */
  VELOCITY_DISSIPATION: number
  /**
   * @default 0.8
   */
  PRESSURE: number
  /**
   * @default 20
   */
  PRESSURE_ITERATIONS: number
  /**
   * @default 30
   */
  CURL: number
  /**
   * @default 0.35
   */
  SPLAT_RADIUS: number
  /**
   * @default 6000
   */
  SPLAT_FORCE: number
  /**
   * @default true
   */
  SHADING: boolean
  /**
   * @default true
   */
  COLORFUL: boolean
  /**
   * @default 10
   */
  COLOR_UPDATE_SPEED: number
  /**
   * @default false
   */
  PAUSED: boolean
  /**
   * @default { r: 0, g: 0, b: 0 }
   */
  BACK_COLOR: { r: number; g: number; b: number }
  /**
   * @default false
   */
  TRANSPARENT: boolean
  /**
   * @default true
   */
  BLOOM: boolean
  /**
   * @default 8
   */
  BLOOM_ITERATIONS: number
  /**
   * @default 256
   */
  BLOOM_RESOLUTION: number
  /**
   * @default 0.8
   */
  BLOOM_INTENSITY: number
  /**
   * @default 0.6
   */
  BLOOM_THRESHOLD: number
  /**
   * @default 0.7
   */
  BLOOM_SOFT_KNEE: number
  /**
   * @default true
   */
  SUNRAYS: boolean
  /**
   * @default 196
   */
  SUNRAYS_RESOLUTION: number
  /**
   * @default 1.0
   */
  SUNRAYS_WEIGHT: number
}

declare module 'webgl-fluid' {
  function WebGLFluid(
    canvas: HTMLCanvasElement,
    options?: Partial<Options>
  ): void
  export = WebGLFluid
}
