import Box from '@mui/material/Box'

function BoardContent() {
  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      height: 'calc(100vh - 58px - 48px)',
      alignItems: 'center',
      backgroundColor: 'primary.main'
    }}>
      Content
    </Box>
  )
}

export default BoardContent
