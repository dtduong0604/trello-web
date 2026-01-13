import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { 
  DndContext, 
  PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter
} from '@dnd-kit/core'

import { MouseSensor, TouchSensor } from '~/customLibararies/DndKitSensors'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}


function BoardContent({board, createNewColumn, createNewCard, moveColumns, moveCardInTheSameColumn, moveCardToDifferentColumn, deleteColumnDetails}) {
  const pointerSensor = useSensor(PointerSensor, {activationConstraint: {distance: 10}})
  const mouseSensor = useSensor(MouseSensor, {activationConstraint: {distance: 10}})
  const touchSensor = useSensor(TouchSensor, {activationConstraint: {delay: 250, tolerance: 500}})

  const sensors = useSensors(mouseSensor,touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])

  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  const lastOverId = useRef(null)


  useEffect(() =>{
    setOrderedColumns(board?.columns)
  },[board])

  const dropAnimation =  {
    sideEffects: defaultDropAnimationSideEffects({ styles : { active: { opacity: '0.5'}}})
  }

  const findColumnByCardId = (cardId) =>{
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {

    setOrderedColumns(
      prevColumns => {
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0

        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        if(nextActiveColumn){
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardData._id)

          if(isEmpty(nextActiveColumn.cards)) {
            nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
          }

          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if(nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardData._id)

          const rebuild_activeDraggingData = {
            ...activeDraggingCardData,
            columnId: nextOverColumn._id
          }

          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex,0, rebuild_activeDraggingData)

          nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }
        if(triggerFrom === 'handleDragEnd')
          moveCardToDifferentColumn(
            activeDraggingCardId,
            oldColumnWhenDraggingCard._id,
            nextOverColumn._id,
            nextColumns
          )
        return nextColumns

      }
    )
  }

  const collisionDetectionStrategy = useCallback((args) => {
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN){
      return closestCorners({...args})
    }

    const pointerIntersections = pointerWithin(args)

    if(!pointerIntersections.length) return

    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    let overId = getFirstCollision(pointerIntersections,'id')

    if(overId) {

      const checkColumn = orderedColumns.find(column => column._id === overId)
      if(checkColumn) {
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }
    }

    lastOverId.current = overId
    return [{ id: overId}]
  }, [activeDragItemType,orderedColumns])

  const handleDragStart = (event) =>{
    console.log('handleDragStart: ',event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD :  ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    if(event?.active?.data?.current?.columnId ){
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const {active, over} = event

    if(!active || !over) return

    const {id: activeDraggingCardId, data: {current: activeDraggingCardData} } = active
    const {id: overCardId} = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if(!activeColumn || !overColumn) return

    if(!activeColumn != overColumn){
      moveCardBetweenDifferentColumns( overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData, 'handleDragOver') 
    }


  }

  const handleDragEnd = (event) => {

    const {active , over } = event 

    if(!over || !active) return


      //keo tha card
      if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD){


      const {id: activeDraggingCardId, data: {current: activeDraggingCardData} } = active
      const {id: overCardId} = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if(!activeColumn || !overColumn) return

      if(oldColumnWhenDraggingCard._id != overColumn._id){
        moveCardBetweenDifferentColumns( overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData, 'handleDragEnd')
      }
      //cung cot
      else{
        const oldCardIndex = oldColumnWhenDraggingCard?.cards.findIndex(c => c._id === activeDraggingCardId)
        const newCardIndex = overColumn?.cards.findIndex(c => c._id === overCardId)

        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)

        setOrderedColumns(
          prevColumns => {
            const nextColumns = cloneDeep(prevColumns)

            const targetColumn = nextColumns.find(column => column._id === overColumn._id)
            targetColumn.cards = dndOrderedCards

            targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

            return nextColumns
          }
        )

        moveCardInTheSameColumn(dndOrderedCards,dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }


    }


    //keo tha column
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN){
      if(active.id !== over.id) {
        const oldIndex = orderedColumns.findIndex(c => c._id == active.id)
        const newIndex = orderedColumns.findIndex(c => c._id == over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
        
        moveColumns(dndOrderedColumns)

        setOrderedColumns(dndOrderedColumns)
        }
    }

    
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  return (

    <DndContext 
      onDragEnd={handleDragEnd} git 
      onDragOver={handleDragOver} 
      onDragStart={handleDragStart} 
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => (theme.trelloCustom.boardContentHeight),
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} createNewColumn={createNewColumn} createNewCard={createNewCard} deleteColumnDetails={deleteColumnDetails}/>
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
