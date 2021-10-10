import {useCallback, useEffect} from "react";
import {createGlobalState} from 'react-use'

interface Todo {
  id: number;
  text: string;
}

const useGlobalTodos = createGlobalState<Todo[]>([]) // creating global state with the 'react-use' library

export function useTodos(initialTodos: Todo[]): {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: number) => void;
} {
  const [todos, setTodos] = useGlobalTodos() // implementing the global state

  useEffect(()=>{
  setTodos(initialTodos)
  },[initialTodos])

  const addTodo = useCallback((text: string) => {
    setTodos([...todos,{ id:todos.length, text: text}])
  }, [todos])

  const removeTodo = useCallback((removeId: number) => {
    setTodos(todos.filter(({id}) => id !== removeId))
  }, [todos])

  return {todos, addTodo, removeTodo}
}