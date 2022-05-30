import React, { useState, useEffect } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const Login = (props) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    //useEffect 컴포넌트가 재평가 될 때마다 재실행됨
    const identifier = setTimeout(() => {
      //setTimeout 브라우저에 내장되어있는 함수 Effect,리액트와는 아무 관련이 없다
      console.log("checking form validit");
      setFormIsValid(
        enteredEmail.includes("@") && enteredPassword.trim().length > 6
      );
    }, 3000); //5초마다 갱신한다.3000 3초

    return () => {
      //클린업 함수
      // 언제 실행되는지?
      // useEffect가 처음! 실행되는 경우를 제외하고는 useEffect가 실행되기 전에 실행된다
      //dom에서 마운트가 해제될 떄마다 언마운트 , 즉 컴포넌트가 재사용될 때마다
      console.log("CLEANUP");
      clearTimeout(identifier); //타임아웃이 실god되기 전의 시간을 초기화 해줌, 새로운 타이머를 설정하기 전에 마지막 타이머를 지운다
    };
  }, [enteredEmail, enteredPassword]); //의존성 변경된 경우에만 실행한다  //변경된게 없으면 useEffect는 실행되지 않음
  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const validateEmailHandler = () => {
    setEmailIsValid(enteredEmail.includes("@"));
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(enteredEmail, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
