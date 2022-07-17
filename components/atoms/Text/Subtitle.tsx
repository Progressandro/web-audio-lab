import { Text } from '@chakra-ui/react'

function Subtitle({ children }: { children: React.ReactNode }) {
  return (
    <Text fontSize="lg" fontWeight="bold" color="gray.500">
      {children}
    </Text>
  )
}

export default Subtitle
