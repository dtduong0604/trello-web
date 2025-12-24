import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as trelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Button from '@mui/material/Button'
import Started from './Menus/Started'
import Templates from './Menus/Templates'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'

function AppBar() {
  const [searchValue, setSearchvalue] = useState('')
  return (
    <div>
      <Box px={2} sx={{
          width: '100%',
          height: (theme) => theme.trelloCustom.appBarHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          paddingX: 2,
          overflowX: 'auto',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
          <AppsIcon sx={{ color: 'white'}} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} >
            <SvgIcon component={trelloIcon} fontSize="small" inheritViewBox sx={{ color: 'white' }}/>
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
          </Box>
          <Box sx={{display: {xs: 'none' , md: 'flex'}}}>
            <Workspaces />
            <Recent />
            <Started />
            <Templates />
            <Button 
              variant="outlined" 
              startIcon={<AddToPhotosIcon />}
              sx={{
                color: 'white',
                border: 'none',
                '&:hover': {
                  border: 'none'
                }
              }} 
            >
              CREATE
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
          <TextField 
            id="outlined-search" label="Search ..." 
            type="text" 
            size='small' 
            sx={{
              mt: 0.5,
              minWidth: '120px' ,
              maxWidth: '180px',
              '& label': {color: 'white'},
              '& input': {color: 'white'},
              '& label.Mui-focused': {color: 'white'},
              '& .MuiOutlinedInput-root': {
                '& fieldset': {borderColor: 'white'},
                '&:hover fieldset': {borderColor: 'white'}
              }
            }}
            value={searchValue}
            onChange={(e) => {setSearchvalue(e.target.value)}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{color: 'white'}} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <CloseIcon sx={{color: searchValue ? 'white' : 'transparent', size: 'small', cursor: 'pointer'}} onClick={()=>{setSearchvalue('')}} />
                </InputAdornment>
              )
            }}
          />
          <ModeSelect />
          <Tooltip title='Notification'>
              <Badge badgeContent={4} color="warning" variant='dot' sx={{ cursor: 'pointer' }} >
                <NotificationsNoneIcon sx={{color: 'white'}} />
              </Badge>
          </Tooltip>
          <Tooltip title='Help'>
              <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
          </Tooltip>
          <Profiles />
        </Box>
      </Box>
    </div>
  )
}

export default AppBar
