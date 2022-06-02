import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const emailReducer = (state, action) => {
  //빠깥에서 정의된 이유는 리듀서 함수 내부에서는 컴포넌트 함수 내부에서 만들어진 어떤 데이터도 필요하지 않기 때문
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") }; //isValid 유효성검사
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 }; //isValid 유효성검사
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");    useEffect 사용시 상태값
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  //useReducer : 컴포넌트의 상태 업데이트로 로직을 컴포넌트에서 분리시킬수 있다.
  //상태 업데이트 로직을 컴포넌트 바깥에 작성할 수 도 있고, 심지어 다른 파일에 작성 후 불러와서 사용할수도 있다.
  //새로 업데이트된 state를 반환한다.
  //const [<상태 객체>, <dispatch 함수>] = useReducer(<reducer 함수>, <초기 상태>, <초기 함수>)
  // dispatch 함수는 컴포넌트 내에서 상태 변경을 일으키기 위해서 사용되는데 인자로 reducer 함수에 넘길 행동(action) 객체를 받습니다
  //컴포넌트에서 dispatch 함수에 행동(action)을 던지면, reducer 함수가 이 행동(action)에 따라서 상태(state)를 변경해줍니다.
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    //초기값 설정
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
    //isValid 유효성검사
  });

  useEffect(() => {
    console.log("EFFECT RUNNING");
    return () => {
      console.log("EFFECT CLEANUP");
    };
  }, []);
  //객체 디스트럭처링 : 객체의 특정 속성을 축출함
  // useEffect최적화 하고 이펙트가 불필요하게 실행되는 것을 막아줌
  const { isValid: emailIsValid } = emailState; //값 할당x 별칭 할당임 emailState의 isValid 속성을 꺼내어 emailIsValid저장함
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    //useEffect 컴포넌트가 재평가 될 때마다 재실행됨
    const identifier = setTimeout(() => {
      //setTimeout 브라우저에 내장되어있는 함수 Effect,리액트와는 아무 관련이 없다
      console.log("checking form validit");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500); //5초마다 갱신한다.3000 3초

    return () => {
      //클린업 함수
      // 언제 실행되는지?
      // useEffect가 처음! 실행되는 경우를 제외하고는 useEffect가 실행되기 전에 실행된다
      //dom에서 마운트가 해제될 떄마다 언마운트 , 즉 컴포넌트가 재사용될 때마다
      console.log("CLEANUP");
      clearTimeout(identifier); //타임아웃이 실god되기 전의 시간을 초기화 해줌, 새로운 타이머를 설정하기 전에 마지막 타이머를 지운다
    };
  }, [emailIsValid, passwordIsValid]); //의존성 변경된 경우에만 실행한다  //변경된게 없으면 useEffect는 실행되지 않음

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
    // setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
    // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
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
