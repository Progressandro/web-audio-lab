import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import DefaultLayout from 'components/templates/DefaultLayout'
import { Content } from 'components/molecules/ContentsTable'
import { useCallback } from 'react'
import Contents from 'components/organisms/Contents'
import { useRouter } from 'next/router'

const contents: Content[] = [
  {
    title: 'Playing Audio',
    url: 'playing-audio',
  },
  {
    title: 'Buffering Audio',
    url: 'buffering-audio',
  },
  {
    title: 'Gain Node',
    url: 'gainNode',
  },
  {
    title: 'Visualizing Waveforms',
    url: 'visualizing-waveforms',
  },
]
const Home: NextPage = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const onContentClick = useCallback(
    (content: Content): void => {
      if (router.isReady) {
        router.push(`/experiments/${content.url}`)
      }
    },
    [router]
  )

  return (
    <DefaultLayout title={t('title')}>
      <Contents contents={contents} onContentClick={onContentClick} />
    </DefaultLayout>
  )
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
