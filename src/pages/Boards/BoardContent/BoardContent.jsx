import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import React, { useEffect, useState } from 'react'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { 
  DndContext, 
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}


function BoardContent({board}) {
  const pointerSensor = useSensor(PointerSensor, {activationConstraint: {distance: 10}})
  const mouseSensor = useSensor(MouseSensor, {activationConstraint: {distance: 10}})
  const touchSensor = useSensor(TouchSensor, {activationConstraint: {delay: 250, tolerance: 500}})

  const sensors = useSensors(mouseSensor,touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])

  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() =>{
    setOrderedColumns(mapOrder(board?.columns,board?.columnOrderIds,'_id'))
  },[board])

  const dropAnimation =  {
    sideEffects: defaultDropAnimationSideEffects({ styles : { active: { opacity: '0.5'}}})
  }

  const findColumnByCardId = (cardId) =>{
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) =>{
    console.log('handleDragStart: ',event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD :  ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragOver = (event) => {
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    console.log('Drage over', event)
    const {active, over} = event

    if(!active || !over) return

    const {id: activeDraggingCardId, data: {current: activeDraggingCardData} } = active
    const {id: overCardId} = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if(!activeColumn || !overColumn) return

    if(!activeColumn != overColumn){
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

            nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
          }

          if(nextOverColumn) {
            nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardData._id)

            nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex,0,activeDraggingCardData)

            nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
          }


          return nextColumns

        }
      )
    }


  }

  const handleDragEnd = (event) => {
    console.log('handleDragEnd',event)

    const {active , over } = event 

    if(!over) return
    
    if(active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(c => c._id == active.id)
      const newIndex = orderedColumns.findIndex(c => c._id == over.id)

      const dndOrderedColums = arrayMove(orderedColumns, oldIndex, newIndex)
      
      setOrderedColumns(dndOrderedColums)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  return (

    <DndContext 
      onDragEnd={handleDragEnd} git 
      onDragOver={handleDragOver} 
      onDragStart={handleDragStart} 
      sensors={sensors}
      collisionDetection={closestCorners}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => (theme.trelloCustom.boardContentHeight),
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
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
