import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'

const Home: NextPage = () => {
  const { t } = useTranslation('common')
  return <h1>{t('title')}</h1>
}

export async function getStaticProps({
  locale,
}: GetStaticProps & { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  }
}

export default Home
