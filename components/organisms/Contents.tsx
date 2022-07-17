import Subtitle from 'components/atoms/Text/Subtitle'
import ContentsTable, { Content } from 'components/molecules/ContentsTable'

interface ContentsProps {
  contents: Content[]
  onContentClick: (content: Content) => void
}
function Contents({ contents, onContentClick }: ContentsProps): JSX.Element {
  return (
    <>
      <Subtitle>Contents Table</Subtitle>
      <ContentsTable contents={contents} onContentClick={onContentClick} />
    </>
  )
}

export default Contents
