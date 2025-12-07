import { experimental_extendTheme as extendTheme} from '@mui/material/styles'
import { cyan, deepOrange, orange, teal } from '@mui/material/colors'
import { BorderColor } from '@mui/icons-material'

const APP_BAR_HEIGHT = '60px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const COLLUMN_HEADER_HEIGHT = '50px'
const COLLUMN_FOOTER_HEIGHT = '50px'

// Create a theme instance.
const theme = extendTheme({
  trelloCustom: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLLUMN_FOOTER_HEIGHT
  },
  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: deepOrange
        
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary: orange
        
    //   }
    // },
  },
  // ...other properties
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#ecf0f1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: 'white'
          }
        }
      }
    },
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textTransform: 'none'
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        // Name of the slot
        root: ({theme}) => ({
          // color: theme.palette.primary.main,
          fontSize: '0.875rem'
        })
      },
    },
    MuiTypography: {
      styleOverrides: {
        // Name of the slot
        root: {
          // color: theme.palette.primary.main,
          '&.MuiTypography-body1': {fontSize: '0.875rem'}
        }
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Name of the slot
        root: ({theme}) => {
          return {
            // color: theme.palette.primary.main,
            // fontSize: '0.875rem',
            // '.MuiOutlinedInput-notchedOutline' : {
            //   borderColor: theme.palette.primary.light
            // },
            // '&:hover': {
            //   '.MuiOutlinedInput-notchedOutline' : {
            //     borderColor: theme.palette.primary.light
            //   }
            // },
            // '& fieldset': {
            //   borderWidth: '1px !important'
            // }
          }
        }
      },
    },
  },
})

export default theme