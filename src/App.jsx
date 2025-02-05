import './App.css';
import Search from './components/Search';
import { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Card from './components/Card';
import { useDebounce } from 'react-use';
import { updateTrend, getTrends } from './appwrite';
import Trending from './components/Trending';

function App() {
  const [searchWord, setSearchWord] = useState('')
  const [movies, setMovies] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [isloading, setIsLoading] = useState(false)
  const [debouncedSearchWord, setDebouncedSearchWord] = useState('')  
  const [trendingMovies, setTrendingMovies] = useState([])

  // debounce the search word to avoid making too many requests
  // by waiting for the user to stop typing for a certain amount of time which is 700ms as the second argument
  useDebounce(() => {setDebouncedSearchWord(searchWord)}, 700, [searchWord])

  const MOVIES_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = 'https://api.themoviedb.org/3';
  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${MOVIES_API_KEY}`
    }
  };

  const get_movies = async () => {
    // at first make sure to show a loading spinner as the data is being fetched
    setIsLoading(true);
    // make sure to clear any previous error messages
    setErrorMessage(null);
    setMovies([]);

    try {
      const url = debouncedSearchWord? `${API_URL}/search/movie?query=${debouncedSearchWord}` : `${API_URL}/discover/movie?sort_by=popularity.desc`;
      
      const response = await fetch(url, API_OPTIONS);

      // check if the response is not ok then throw an error
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      // check the data response if it is false then throw an error and set the movies into empty array
      if (data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovies([]);
        return; // Exit the function early if the response is not ok
      }

      // set the movies into the data results or empty array in case something went wrong
      setMovies(data.results || []);

      // update the trending movies in the database
      if (searchWord && data.results.length > 0) {
        await updateTrend(searchWord, data.results[0]);
      }

    } catch (err) {
      console.error(err);
      // catch any error and set the error message
      setErrorMessage('Failed to fetch movies');
    } finally {
      // make sure to hide the loading spinner once the data has been fetched
      setIsLoading(false);
    }
  }

  const get_trending_movies = async () => {
    try{
      const trends = await getTrends();
      setTrendingMovies(trends);

    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    get_movies();
  }, [debouncedSearchWord]);

  useEffect(() => {
    get_trending_movies();
  }, []);


  return (
    <>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy Without the Hassle</h1>

          <Search searchWord={searchWord} setSearchWord={setSearchWord} />
        </header>
        
         {trendingMovies.length > 0 && (<section className="trending">
          <h2>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <Trending key={movie.$id} movie={movie} index={index}/>
            ))}
          </ul>
          </section>)}
        <section className="all-movies">
          <h2>All Movies</h2>
          {isloading ? <Loader /> : errorMessage ? <p className="error-message">{errorMessage}</p> : (
            <ul>
              {movies.map((movie) => (
                <Card key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
       
       
      </div>
    </>
  )
}

export default App
