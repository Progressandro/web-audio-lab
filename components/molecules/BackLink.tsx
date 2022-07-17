import CommonLink from 'components/atoms/Text/CommonLink'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

function BackLink() {
  const router = useRouter()
  const { t } = useTranslation('common')
  return (
    <CommonLink onClick={() => router.back()} fontSize="2xl">
      {t('back')}
    </CommonLink>
  )
}

export default BackLink
