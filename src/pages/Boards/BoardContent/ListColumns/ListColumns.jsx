import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import { Button, colors } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import {SortableContext, horizontalListSortingStrategy} from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'


function ListColumns({columns, createNewColumn, createNewCard, deleteColumnDetails}) {

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewCoulmnForm = () => {setOpenNewColumnForm(!openNewColumnForm)}

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if(!newColumnTitle){
      toast.error('Please enter Column Title',{position: 'top-center'})
      return
    }

    const newColumnData = {
      title: newColumnTitle
    }
    
    await createNewColumn(newColumnData)
    toggleOpenNewCoulmnForm(),
    setNewColumnTitle('')

  }

  return (
    <SortableContext items={columns.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {/* column */}
        {
          columns?.map((column) =>{
            return <Column key={column._id} column={column} createNewCard={createNewCard} deleteColumnDetails={deleteColumnDetails}/>
          }

          )
        }

        {
          !openNewColumnForm

          ? <Box onClick={toggleOpenNewCoulmnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                widows: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                pi: 1
              }}
            >
              Add new column
            </Button>
          </Box>

          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: '1'
          }}>
            <TextField 
              label="Enter column title ..." 
              type="text" 
              size='small'
              value={newColumnTitle}
              onChange={event => setNewColumnTitle(event.target.value)} 
              sx={{
                mt: 0.5,
                minWidth: '230px' ,
                maxWidth: '230px',
                '& label': {color: 'white'},
                '& input': {color: 'white'},
                '& label.Mui-focused': {color: 'white'},
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {borderColor: 'white'},
                  '&:hover fieldset': {borderColor: 'white'},
                  '&.Mui-focused fieldset': {borderColor: 'white'}
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
              <Button
                onClick={addNewColumn}
                variant='contained' color='success' size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '$:hover': { bgcolor: (theme) => theme.palette.success.main}
                }}  
              >
                Add Column
              </Button>
              <CloseIcon 
                sx={{color: 'white', cursor: 'pointer'}} 
                onClick={toggleOpenNewCoulmnForm} />
            </Box>
          </Box>
        }

        
      </Box>
    </SortableContext>
  )
}

export default ListColumns
