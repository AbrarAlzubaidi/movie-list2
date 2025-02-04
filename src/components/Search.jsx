import PropTypes from 'prop-types';

const Search = ({ searchWord, setSearchWord }) => {

    const handleInputChange = (e) => {
        setSearchWord(e.target.value);
    };

    return (
        <div className='search'>
            <div>
                <img src="./search.svg" alt="Search Icon" />
                <input
                    type="text"
                    value={searchWord}
                    onChange={handleInputChange}
                    placeholder="Search for a movie..."
                />
            </div>
        </div>
    );
};
Search.propTypes = {
    searchWord: PropTypes.string.isRequired,
    setSearchWord: PropTypes.func.isRequired,
};

export default Search;