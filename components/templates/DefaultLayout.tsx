import { Stack } from '@chakra-ui/react'
import Title from 'components/atoms/Text/Title'

interface DefaultLayoutProps {
  children: React.ReactNode
  title: string
}

function DefaultLayout({ children, title }: DefaultLayoutProps): JSX.Element {
  return (
    <Stack w="full" h="full" p={8} spacing={3}>
      <Title>{title}</Title>
      {children}
    </Stack>
  )
}

export default DefaultLayout
