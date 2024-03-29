import { Center } from '@chakra-ui/react'
import BackLink from 'components/molecules/BackLink'
import SoundPlayer from 'components/molecules/Players/SoundPlayer'
import DefaultLayout from 'components/templates/DefaultLayout'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Experiments: NextPage = () => {
  const { t } = useTranslation('experiments_playing-audio')
  return (
    <DefaultLayout title={t('title')}>
      <Center>
        <SoundPlayer src="/audio/piano.mp3" />
      </Center>
      <BackLink />
    </DefaultLayout>
  )
}

export async function getStaticProps({
  locale,
}: GetStaticProps & { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'experiments_playing-audio',
        'common',
      ])),
      // Will be passed to the page component as props
    },
  }
}

export default Experiments
