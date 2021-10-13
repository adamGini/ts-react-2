import React, {ReactNode, useCallback, useRef} from 'react';
import './App.css';
import store, {selectTodos, addTodo, removeTodo} from './store'
import {Provider, useDispatch, useSelector} from 'react-redux'


const Heading = ({title}: { title: string }) => <h2>{title}</h2>

const Box: React.FunctionComponent = ({children}) =>
  (<div style={{
    padding: "1rem",
    fontWeight: "bold"
  }}>
    {children}
  </div>
  )

// generic list
function UL<T>({
                 items,
                 render,
                 itemClick,
                 /*children if we wanted children we would declare them here and change the type as below:*/
               }:
                 { items: T[], render: (item: T) => ReactNode, itemClick:(item:T)=>void } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>
                 /*{ items: T[], render: (item: T) => ReactNode } & React.propsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>>*/
) {
  return (
    <ul>
      {items.map((item, idx) => (
        <li onClick={()=>itemClick(item)} key={idx}>{render(item)}</li>
      ))}
    </ul>
  )
}


function App() {
  const todos = useSelector(selectTodos)
  const dispatch = useDispatch()

  const newTodoRef = useRef<HTMLInputElement>(null)

  const onAddTodo = useCallback(() => {
    if (newTodoRef.current) {
      dispatch(addTodo(newTodoRef.current.value))
      newTodoRef.current.value = "";
    }
  }, [dispatch])

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


      <h1>Generic list</h1>
      <input type="text" ref={newTodoRef}/>
      <button onClick={onAddTodo}>Add Todo</button>
      <UL
        /* since we defined the component as having detailed html props, we could pass things like className...*/
        items={todos}
        itemClick={(item)=>alert(item.id)}
        render={(todo) => (
          <>
            {todo.text + ' '}
            <button onClick={() => dispatch(removeTodo(todo.id))}>Remove</button>
          </>
        )}
      />

    </div>

  );
}

const JustTheTodos = () => {
  const todos = useSelector(selectTodos)

  return (
    <UL
      items={todos}
      itemClick={() => {
      }}
      render={(todo) => (
        <>
          {todo.text + ' '}
        </>
      )}
    />
  )
}

const AppWrapper = () => (
  <Provider store={store}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '50% 50%'
    }}>
      <App/>
      <JustTheTodos/>
    </div>
  </Provider>
)

export default AppWrapper;
