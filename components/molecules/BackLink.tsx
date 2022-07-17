import CommonLink from 'components/atoms/Text/CommonLink'
import { useRouter } from 'next/router'

function BackLink() {
  const router = useRouter()
  return (
    <CommonLink onClick={() => router.back()} fontSize="2xl">
      Back ⏪
    </CommonLink>
  )
}

export default BackLink
