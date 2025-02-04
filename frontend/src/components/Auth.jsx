import React, { useState } from 'react'
import { useFormik } from 'formik';
import { auth, googleProvider } from "../config/firebase"
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"

const Auth = () => {
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: async (values) => {
            try {
                await createUserWithEmailAndPassword(auth, values.email, values.password)
                formik.resetForm();
            } catch (error) {
                alert(`Something went Wrong in Signing Up, ${error}`)
            }
        }
    })


    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
        } catch (error) {
            alert(`Someting went Wrong in Signing Up with Google, ${error}`)
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            alert(`Someting went Wrong in Logging Out, ${error}`)
        }
    }

    return (
        <section className='mt-5'>
            <div className='container'>
                <form onSubmit={formik.handleSubmit}>
                    <div className='row'>
                        <div className="col-lg-12 mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id='email' name='email' onChange={formik.handleChange} value={formik.values.email} />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="col-lg-12 mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id='password' name='password' onChange={formik.handleChange} value={formik.values.password} />
                            <button type="submit" className="btn btn-success mt-3" >Sign In</button>
                        </div>
                    </div>
                </form>
                <div className='row'>
                    <div className='col-lg-3'>
                        <button onClick={signInWithGoogle} className='form-control btn btn-outline-primary'>Sign in with Google</button>
                        <button onClick={logout} className='form-control btn btn-outline-danger mt-3'>Logout</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Auth 