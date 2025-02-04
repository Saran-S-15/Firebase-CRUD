import React, { useEffect, useState } from 'react'
import './App.css'
import { useFormik } from 'formik';
import Auth from './components/Auth'
import { db, auth } from "./config/firebase"
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"

const App = () => {
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      releaseDate: "",
      receivedAnOscar: false,
      userId: auth?.currentUser?.uid
    },
    validate: values => {
      let error = {}

      if (values.title === "") {
        error.title = "Please enter a title"
      }
      if (values.releaseDate === "") {
        error.releaseDate = "Please enter the release date"
      }

      return error
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const movieData = {
          ...values,
          userId: auth?.currentUser?.uid
        };

        if (update) {
          const updatedMovie = doc(moviesCollection, id);
          await updateDoc(updatedMovie, movieData);
          setUpdate(false);
          setId(null);
        } else {
          await addDoc(moviesCollection, movieData);
        }
        getMovieList();
        formik.resetForm();
      } catch (error) {
        alert(`Something went Wrong while Submitting Data, ${error}`);
      } finally {
        setIsLoading(false);
      }
    }
  })


  const [movieList, setMovieList] = useState([]);

  const moviesCollection = collection(db, "Movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(), id: doc.id
      }))
      setMovieList(filteredData)
    } catch (error) {
      alert(`Something went Wrong in Fetching Data ${error}`)
    }
  }

  useEffect(() => {
    getMovieList();
  }, [])

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(moviesCollection, id);
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (error) {
      alert(`Something went Wrong in Deleting, ${error}`);
    }
  }

  const updateMovie = async (movie) => {
    try {
      formik.setValues(movie)
      setUpdate(true)
      setId(movie.id)
    } catch (error) {
      alert(`Something went Wrong in Updating, ${error}`);
    }
  }


  return (
    <div className='container'>
      <Auth />

      <div className='row'>
        <div className='col-lg-6'>
          <form onSubmit={formik.handleSubmit}>
            <input placeholder='Movie Title' type='text' name='title' id="title" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.title} className='form-control mt-5' />
            {
              formik.touched.title ? <span style={{ color: "red" }}>{formik.errors.title}</span> : null
            }
            <input placeholder='Release Date' type='number' name='releaseDate' id="releaseDate" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.releaseDate} className='form-control mt-3' />
            {
              formik.touched.releaseDate ? <span style={{ color: "red" }}>{formik.errors.releaseDate}</span> : null
            }
            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" value={formik.values.receivedAnOscar} onChange={formik.handleChange} name='receivedAnOscar' id="receivedAnOscar" />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Received an Oscar
              </label>
            </div>
            <button type='submit' className='btn btn-warning mt-3' disabled={!formik.isValid}>
              {
                isLoading ? (<div class="spinner-border text-dark" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>) : ("Submit")
              }
            </button>
          </form>
        </div>
      </div>

      <div className='row'>
        {
          movieList.length > 0 ? (movieList.map((movie) => {
            return <div key={movie.id} className='col-lg-3 mt-3 mb-2'>
              <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>{movie.title}</h1>
              <p>Date: {movie.releaseDate}</p>
              <button onClick={() => deleteMovie(movie.id)} className='btn btn-danger'>Delete Movie</button>
              <button onClick={() => updateMovie(movie)} className='btn btn-info ms-2'>Update Movie</button>
            </div>
          })) : (<h3 className='mt-3'>No Movies Added</h3>)
        }
      </div>
    </div>
  )
}

export default App