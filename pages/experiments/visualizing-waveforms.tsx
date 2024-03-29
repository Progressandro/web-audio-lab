import { Center } from '@chakra-ui/react'
import BackLink from 'components/molecules/BackLink'
import WaveformVisualizer from 'components/molecules/Visualizers/WaveformVisualizer'
import DefaultLayout from 'components/templates/DefaultLayout'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Experiments: NextPage = () => {
  const { t } = useTranslation('experiments_visualizing-waveforms')
  return (
    <DefaultLayout title={t('title')}>
      <Center>
        <WaveformVisualizer src="/audio/chime.mp3" />
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
        'experiments_visualizing-waveforms',
        'common',
      ])),
      // Will be passed to the page component as props
    },
  }
}

export default Experiments
