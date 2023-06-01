import { createContext } from "react";

// Modelo
export interface Todo {
  id: string;
  desc: string;
  completed: boolean;
}

// Forma del State
export interface TodoState {
  todoCount: number;
  todos: Todo[];
}

// Props del context
export type TodoContextProps = {
  todoState: TodoState;
  toggleTodo: (id: string) => void;
};

export const TodoContext = createContext<TodoContextProps>({} as TodoContextProps)
