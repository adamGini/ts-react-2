
import React, {useCallback, useRef} from 'react';
import './App.css';
import {useTodos} from './useTodos' // this is our custom hook - woohoo!


const Heading = ({title}: { title: string }) => <h2>{title}</h2>

const Box: React.FunctionComponent = ({children}) =>
  (<div style={{
    padding: "1rem",
    fontWeight: "bold"
  }}>
    {children}
  </div>
)

function App() {
  const {todos, addTodo, removeTodo} = useTodos([{id:0, text:"hey there"}])
  const newTodoRef = useRef<HTMLInputElement>(null)

  const onAddTodo = useCallback(() => {
    if (newTodoRef.current) {
      addTodo(newTodoRef.current.value)
      newTodoRef.current.value = "";
    }
  }, [addTodo])

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
          <button onClick={() =>removeTodo(todo.id)}>Remove
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
