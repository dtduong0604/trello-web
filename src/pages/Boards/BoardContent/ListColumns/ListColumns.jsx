import React from 'react'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import { Button, colors } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'


function ListColumns() {
  return (
    <div>
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
        <Column />
        <Column />

        <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
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
      </Box>
    </div>
  )
}

export default ListColumns
