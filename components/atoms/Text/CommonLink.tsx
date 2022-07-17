import { Text, TextProps } from '@chakra-ui/react'

function CommonLink({
  children,
  ...chakraProps
}: TextProps & { children: React.ReactNode }) {
  return (
    <Text size="md" as="u" cursor="pointer" {...chakraProps}>
      {children}
    </Text>
  )
}

export default CommonLink
