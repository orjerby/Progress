
export default (state = null, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { name: 'or' }
        default:
            return state
    }
}