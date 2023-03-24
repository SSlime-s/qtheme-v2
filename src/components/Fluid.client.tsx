import { parseHexNotationColor } from '@/model/color'
import { lightTheme, darkTheme } from '@/utils/theme/default'
import styled from '@emotion/styled'
import { ComponentProps, useEffect, useRef } from 'react'
import WebGLFluid from 'webgl-fluid'

interface Props extends ComponentProps<'canvas'> {
  mode?: 'dark' | 'light'
}
export const Fluid: React.FC<Props> = ({ mode = 'light', ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const themeBackground =
    mode === 'light'
      ? lightTheme.basic.background.primary
      : darkTheme.basic.background.primary
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return
    WebGLFluid(canvas, {
      // DENSITY_DISSIPATION: 1.5,
      DENSITY_DISSIPATION: 0.3,
      VELOCITY_DISSIPATION: 1,
      PRESSURE: 0,
      PRESSURE_ITERATIONS: 1,
      CURL: 0,
      SPLAT_RADIUS: 0.5,
      SPLAT_FORCE: 8000,
      SHADING: false,

      COLOR_UPDATE_SPEED: 5,

      TRANSPARENT: true,
      BACK_COLOR: parseHexNotationColor(themeBackground) ?? {
        r: 0,
        g: 0,
        b: 0,
      },

      BLOOM: false,
      SUNRAYS: false,
    })
  }, [themeBackground])

  return <Canvas ref={canvasRef} {...props} />
}

const Canvas = styled.canvas`
  width: 100vw;
  height: 100vh;
`
