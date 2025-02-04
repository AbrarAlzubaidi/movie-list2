import './App.css';
import Search from './components/Search';
import { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Card from './components/Card';

function App() {
  const [searchWord, setSearchWord] = useState('')
  const [movies, setMovies] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [isloading, setIsLoading] = useState(false)

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

    try {
      const url = `${API_URL}/discover/movie?sort_by=popularity.desc`;

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

    } catch (err) {
      console.error(err);
      // catch any error and set the error message
      setErrorMessage('Failed to fetch movies');
    } finally {
      // make sure to hide the loading spinner once the data has been fetched
      setIsLoading(false);
    }
  }

  useEffect(() => {
    get_movies()
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
