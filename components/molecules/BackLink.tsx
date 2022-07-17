import CommonLink from 'components/atoms/Text/CommonLink'
import { useRouter } from 'next/router'

function BackLink() {
  const router = useRouter()
  return <CommonLink onClick={() => router.back()}>Back</CommonLink>
}

export default BackLink
