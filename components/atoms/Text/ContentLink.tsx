import { Text } from '@chakra-ui/react'

function ContentLink({ children }: { children: React.ReactNode }) {
  return (
    <Text size="md" as="u" cursor="pointer">
      {children}
    </Text>
  )
}

export default ContentLink
