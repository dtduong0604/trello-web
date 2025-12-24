import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId ='6948095e0c530f4784d8e3f6'

    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  return (
      <Container disableGutters maxWidth={false} sx={{height: '100vh'}}>
        <AppBar />
        <BoardBar board={mockData.board} />
        <BoardContent board={mockData.board}/>
      </Container>
    )
}

export default Board
