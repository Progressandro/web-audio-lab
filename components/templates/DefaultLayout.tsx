import { Spacer, Stack } from '@chakra-ui/react'
import Title from 'components/atoms/Text/Title'

interface DefaultLayoutProps {
  children: React.ReactNode
  title: string
}

function DefaultLayout({ children, title }: DefaultLayoutProps): JSX.Element {
  return (
    <Stack w="full" h="full" p={8}>
      <Title>{title}</Title>
      <Spacer dir="vertical" p={2} />
      {children}
    </Stack>
  )
}

export default DefaultLayout
