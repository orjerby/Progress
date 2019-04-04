import React from 'react'
import PropTypes from 'prop-types'
import { FaSearch } from 'react-icons/fa'

export default class Search extends React.Component {
    state = {
        searchValue: ''
    }

    handleChange = (e) => {
        this.setState({ searchValue: e.target.value })
    }

    render() {
        const { searchValue } = this.state
        const { handleSearch } = this.props
        const { handleChange } = this

        return (
            <>
                <input value={searchValue} onChange={handleChange} />
                <FaSearch onClick={() => handleSearch(searchValue)} />
            </>
        )
    }
}

Search.propTypes = {
    handleSearch: PropTypes.func.isRequired
}