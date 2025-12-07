import React from 'react'
import Box from '@mui/material/Box'
import theme from '~/theme'
import Card from './Card/Card'
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'

const COLLUM_HEADER_HEIGHT = theme.trelloCustom.columnHeaderHeight
const COLLUM_FOOTER_HEIGHT = theme.trelloCustom.columnFooterHeight
function ListCard({cards}) {
  return (
    <SortableContext items={cards.map((c) => c._id)} strategy={verticalListSortingStrategy}>
      <Box sx={{
        p: '0 5px',
        m: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) => (`calc(
          ${theme.trelloCustom.boardContentHeight} -
          ${theme.spacing(5)} -
          ${COLLUM_HEADER_HEIGHT} -
          ${COLLUM_FOOTER_HEIGHT}
        )`),
        '&::-webkit-scrollbar-thumb': {
          background: '#ced0da',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#bfc2cf'
        }
      }}>
        {
          cards?.map((card) =>{
            return <Card card={card} key={card._id}/>
          })
        }
      </Box>
    </SortableContext>
          
  )
}

export default ListCard
