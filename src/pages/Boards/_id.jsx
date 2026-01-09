import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { createNewCardAPI, createNewColumnAPI, fetchBoardDetailsAPI, updateBoardDetailsAPI, updateColumnDetailAPI } from '~/apis'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId ='694d62e4e9645a356e3a807e'

    fetchBoardDetailsAPI(boardId).then(board => {

      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        if(isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }

        else{
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      setBoard(board)
    })
  }, [])

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]


    const newBoard = {...board}

    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)

  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    const newBoard = {...board}
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if(columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }

    setBoard(newBoard)
  }

  const moveColumns = async (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds

    setBoard(newBoard)

    console.log(newBoard)

    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds})
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if(columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }

    updateColumnDetailAPI(columnId, {cardOrderIds : dndOrderedCardIds})
  }

  if(!board){
    return (
      <div>
        ...loanding
      </div>
    )
  }

  return (
      <Container disableGutters maxWidth={false} sx={{height: '100vh'}}>
        <AppBar />
        <BoardBar board={board} />
        <BoardContent 
          board={board}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          moveColumns = {moveColumns}
          moveCardInTheSameColumn = {moveCardInTheSameColumn}
        />
      </Container>
    )
}

export default Board
