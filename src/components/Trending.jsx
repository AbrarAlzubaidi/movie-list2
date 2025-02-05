import PropTypes from 'prop-types';

const Trending = ({ movie: { poster_url, searchWord }, index }) => {
    return (
       <li>
           <p>{index+1}</p>
           <img src={poster_url} alt={searchWord} />
       </li>
    );
};

Trending.propTypes = {
    movie: PropTypes.shape({
        poster_url: PropTypes.string,
        searchWord: PropTypes.string,
        movie_id: PropTypes.number,
        count: PropTypes.number,
    }).isRequired,
    index: PropTypes.number.isRequired
};

export default Trending;