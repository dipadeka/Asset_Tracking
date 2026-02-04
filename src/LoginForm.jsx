import React, { useState } from "react";

export default function LoginForm() {
     const [isLogin, setIsLogin] = useState(false);
     return (
          <div className="container">
               <div className="form-container">
                    <div className="form-toggle">
                         <button type="button" className={isLogin ? 'active' : ""} onClick={() => setIsLogin(true)}>Login</button>
                         <button type="button" className={!isLogin ? 'active' : ""} onClick={() => setIsLogin(false)}>Signup</button>
                    </div>
                    {isLogin ? <>
                         <div className='form'>
                              <h2>Login Form</h2>
                              <input type='email' placeholder='Email' />
                              <input type='password' placeholder="Password" />
                              <a href='#'>Forgot Password</a>
                              <button>Login</button>
                              <p>Not a Member? <a href='#' onClick={() => setIsLogin(false)}>Signup Now</a></p>
                         </div>
                    </> : <>
                         <div className='form'>
                              <h2>Signup Form</h2>
                              <input type='email' placeholder='Email' />
                              <input type='password' placeholder='Password' />
                              <input type='password' placeholder='Confirm Password' />
                              <button>Signup</button>
                         </div>
                    </> }
               </div> 
          </div>

     );

     
}

