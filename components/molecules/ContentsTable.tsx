import { ListItem, UnorderedList } from '@chakra-ui/react'
import CommonLink from 'components/atoms/Text/CommonLink'

export interface Content {
  title: string
  url: string
}

export interface ContentsTableProps {
  contents: Content[]
  onContentClick: (content: Content) => void
}

function ContentsTable({
  contents,
  onContentClick,
}: ContentsTableProps): JSX.Element {
  return (
    <>
      <UnorderedList px={4}>
        {contents.map((content) => (
          <ListItem key={content.url} onClick={() => onContentClick(content)}>
            <CommonLink>{content.title}</CommonLink>
          </ListItem>
        ))}
      </UnorderedList>
    </>
  )
}

export default ContentsTable
