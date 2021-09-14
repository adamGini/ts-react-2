
import React, {useCallback, useState, useEffect, useReducer, useRef} from 'react';
import './App.css';


const Heading = ({title}: { title: string }) => <h2>{title}</h2>

const Box: React.FunctionComponent = ({children}) =>
  (<div style={{
    padding: "1rem",
    fontWeight: "bold"
  }}>
    {children}
  </div>
)

interface Todo {
  id: number;
  text: string;
}

type ActionType =
  | { type: "ADD", text: string }
  | { type: "REMOVE", id: number }

function App() {

  const [todos, dispatch] = useReducer((state: Todo[], action: ActionType) => {
    switch (action.type) {
      case "ADD":
        return [
          ...state, // this would be the array of existing todos
          {
            id: state.length,
            text: action.text,
          },
        ];
      case "REMOVE":
        return state.filter(({id}) => id !== action.id);
      default:
        throw new Error()
    }
  }, [])

  const newTodoRef = useRef<HTMLInputElement>(null)

  const onAddTodo = useCallback(() => {
    if (newTodoRef.current) { // typescript is smart enough to know that here we are checking this value is not undefined/null...
      dispatch({
        type: "ADD",
        text: newTodoRef.current.value // ... so that we dont get an error here, telling us it might be undefined/null
      })
      newTodoRef.current.value = "";
    }
  }, [])

  const Button: React.FunctionComponent<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
    > & {title?:string} = ({title,children,style, ...rest})=>(
    <button {...rest} style={{
      ...style,
      fontSize:"large",
      borderRadius:"0.5rem",
    }}>{title ?? children}</button>
  )

  return (
    <div>
      <Heading title="Second part"/>
      <Box>
        Wohoo!
      </Box>

      <Heading title="Todos"/>
      {todos.map(todo => (
        <div key={todo.id}>
          {todo.text + ' '}
          <button onClick={() => dispatch({
            type: "REMOVE",
            id: todo.id,
          })}>Remove
          </button>
        </div>
      ))}
      <div>
        <input type="text" ref={newTodoRef}/>
        <button onClick={onAddTodo}>Add Todo</button>
      </div>

    </div>

  );
}

export default App;
