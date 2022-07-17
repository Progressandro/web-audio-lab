import { Text } from '@chakra-ui/react'

function Title({ children }: { children: React.ReactNode }) {
  return (
    <Text fontSize="4xl" fontWeight="bold" mb={4}>
      {children}
    </Text>
  )
}

export default Title
