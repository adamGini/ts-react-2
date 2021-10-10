import {useCallback, useReducer, createContext, useContext} from "react";

interface Todo {
  id: number;
  text: string;
}

type ActionType =
  | { type: "ADD", text: string }
  | { type: "REMOVE", id: number }

type useTodosManagerResult = ReturnType<typeof useTodosManager>

const TodoContext = createContext<useTodosManagerResult>({ // the defult value we pass here is just to satisfy useContext. Its never actually used
  todos: [],
  addTodo: () => {},
  removeTodo: () => {}
})

function useTodosManager(initialTodos: Todo[]): {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: number) => void;
} {

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
  }, initialTodos)

  const addTodo = useCallback((text: string) => {
    dispatch({
      type: "ADD",
      text
    })
  }, [])

  const removeTodo = useCallback((id: number) => {
    dispatch({
      type: "REMOVE",
      id,
    })
  }, [])

  return {todos, addTodo, removeTodo}
}

export const TodosProvider:React.FunctionComponent<{
  initialTodos: Todo[]
}> = ({initialTodos,children})=>(
  <TodoContext.Provider value={useTodosManager(initialTodos)}>{children}</TodoContext.Provider>
)

export const useTodos = ():Todo[] => {
  const {todos} = useContext(TodoContext)
  return todos
}
export const useAddTodos = ():useTodosManagerResult["addTodo"] => {
  const {addTodo} = useContext(TodoContext)
  return addTodo
}
export const useRemoveTodos = ():useTodosManagerResult["removeTodo"] => {
  const {removeTodo} = useContext(TodoContext)
  return removeTodo
}