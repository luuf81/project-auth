import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { user } from '../reducers/user'
import { Profile } from './Profile'
import picture from '../picture/picture.svg'
import { Button, SignUpImage, LoginSection, Form, InputLabel, LoginInput } from '../styling/form'

const SIGNUP_URL = "http://localhost:8080/users";
const LOGIN_URL = "http://localhost:8080/sessions";

export const LoginForm = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  
  const dispatch = useDispatch()
  const statusMessage = useSelector((store) => store.user.login.statusMessage)
  const loggedIn = useSelector((store) => store.user.login.loggedIn)

  const handleLoginSuccess = (loginResponse) => {
    dispatch(user.actions.setAccessToken({ accessToken: loginResponse.accessToken }));
    dispatch(user.actions.setUserId({ userId: loginResponse.userId }));
    dispatch(user.actions.setStatusMessage({ statusMessage: "Login Success" }));
    dispatch(user.actions.toggleLoggedState(true));
  };

  const handleLoginFailed = (loginError) => {
    dispatch(user.actions.setAccessToken({ accessToken: null }));
    dispatch(user.actions.setStatusMessage({ statusMessage: loginError }));
  };

  // To sign up a user.
  const handleSignup = (event) => {
    event.preventDefault();

    fetch(SIGNUP_URL, {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          throw "Signup Failed";
        }
        return res.json();
      })
      .then((json) => handleLoginSuccess(json))
      .catch((err) => handleLoginFailed(err));
  };

  // To sign up a user.
  const handleLogin = (event) => {
    event.preventDefault();

    fetch(LOGIN_URL, {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          throw 'Login Failed'
        }
        return res.json();
      })
      .then((json) => handleLoginSuccess(json))
      .catch((err) => handleLoginFailed(err));
  };

  // If user is not logged in, show login form
  if (!loggedIn) {
  return (
    <LoginSection>
      <Form>
        <h1>Sign Up/Login:</h1>
        <InputLabel>
          Name
          <LoginInput
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </InputLabel>
        <InputLabel>
          Password
          <LoginInput
            type="password"
            required
            minlength="5"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </InputLabel>
        {`${statusMessage}`}
        <Button 
          type='submit' 
          onClick={handleSignup}
        >
          Sign Up
        </Button>
        <Button type="submit" onClick={handleLogin}>
          Login
        </Button>
        </Form>
        <SignUpImage src={picture} alt="Taking note" />
    </LoginSection>
  );
  }

  // If user is logged in, show profile
  return <Profile />
  
};
export default LoginForm;
