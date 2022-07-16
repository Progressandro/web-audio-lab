import { extendTheme, Theme, ThemeConfig } from '@chakra-ui/react'

const colors: Partial<Theme['colors']> = {}
const config: ThemeConfig = {
  initialColorMode: 'dark',
}

const theme = extendTheme({ colors, config }) as Theme
export default theme
