// another available cheatsheet: https://github.com/typescript-cheatsheets/react
// intrinsic elements in react: https://unpkg.com/@types/react@16.4.7/index.d.ts (search for interface IntrinsicElements)

//  -------------- cli command: npx create-react-app name-of-app --template typescript
import React, {useCallback, useState, useEffect, useReducer, useRef} from 'react';
import './App.css';


// -------------- basic:
const Heading = ({title}: { title: string }) => <h2>{title}</h2>

// -------------- with children:

// const Box = ({children}: { children: React.ReactNode }) => ( //<--------------------------------------nasty way. Type for the props
const Box: React.FunctionComponent = ({children}) => ( // nice way. Type for the const
  <div style={{
    padding: "1rem",
    fontWeight: "bold"
  }}>
    {children}
  </div>
)

// -------------- with props:
const List: React.FunctionComponent<{
  items: string[];
  onClick?: (item: string) => void;
}> = ({items, onClick}) => (
  <ul>
    {items.map((item, idx) => (
      <li key={idx} onClick={() => onClick?.(item)}>{item}</li>// note the use of optional chaining. Necessary because the function is an optional prop (see line 24)
    ))}
  </ul>
)

// ----------- hooks:

interface Payload {
  text: string;
}

interface Todo {
  id: number;
  text: string;
}

type ActionType =
  | { type: "ADD", text: string }
  | { type: "REMOVE", id: number }

function App() {
  const onListClick = useCallback((item: string) => {
    console.log(item);
  }, [])

  // State set to null because its waiting for the payload to come from an external source
  const [payload, setPayload] = useState<Payload | null>(null)

  useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then(data => setPayload(data))
  }, [])

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
// -------------- property types
  // verbose way:
  const [value, setValue] = useState(0)

  const Incrementer: React.FunctionComponent<{
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>; // command + hover over the declaration of the function (line 93) and copy-paste
  }> = ({value, setValue}) => (
    <button onClick={()=>setValue(value + 1)}>
      Add - {value}
    </button>
  )

  const useNumber = (initialValue: number) => useState<number>(initialValue)

  type UseNumberValue = ReturnType<typeof useNumber>[0]
  type UseNumberSetValue = ReturnType<typeof useNumber>[1]

  const [value2, setValue2] = useNumber(0)

  const Incrementer2: React.FunctionComponent<{
    value: UseNumberValue;
    setValue: UseNumberSetValue;
  }> = ({value, setValue}) => (
    <Button onClick={()=>setValue(value + 1)} title={`Add2 - ${value2}`}/>

  )
  const Button: React.FunctionComponent<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
    > & {title?:string} = ({title,children,style, ...rest})=>( // note the '&' extending our original type
    <button {...rest} style={{
      ...style,
      fontSize:"large",
      borderRadius:"0.5rem",
    }}>{title ?? children}</button>
  )

  return (
    <div>
      <Heading title="Introduction"/>
      <Box>
        hello there
      </Box>
      <List items={['one', 'two', 'three']} onClick={onListClick}/>
      <Box>{JSON.stringify(payload)}</Box>

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

    <Incrementer value={value} setValue={setValue} />
    <Incrementer2 value={value2} setValue={setValue2} />

    </div>

  );
}

export default App;
