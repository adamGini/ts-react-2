import {useCallback, useReducer} from "react";

interface Todo {
  id: number;
  text: string;
}

type ActionType =
  | { type: "ADD", text: string }
  | { type: "REMOVE", id: number }

export function useTodos(initialTodos: Todo[]): {
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