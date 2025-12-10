
export const capitalizeFirstLetter = (val) => {
    if(!val) return ''
    return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const generatePlaceholderCard = (column) =>{
    return {
        _id: `${column._id}-placeholder-card`,
        boardId: column.boardId,
        cloumnId: column._id,
        FE_PlaceholderCard: true
    }
}