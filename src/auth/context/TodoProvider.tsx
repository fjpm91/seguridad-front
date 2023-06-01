import { useReducer } from "react";
import { todoReducer } from "./TodoReducer";
import { TodoContext, TodoState } from "./TodoContext";

// Forma del State -> auth context
const initialState: TodoState = {
  todoCount: 0,
  todos: [
    {
      id: '1',
      desc: 'First todo',
      completed: false
    },
    {
      id: '2',
      desc: 'Second todo',
      completed: false
    },
  ]
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const TodoProvider = ({ children }: Props) => {
  const [todoState, dispatch] = useReducer(todoReducer, initialState);

  // type TodoContextProps -> auth context
  const toggleTodo = (id: string) => {
      dispatch({type: 'toggle', payload: {id}});
    };

  return (
    <TodoContext.Provider value={{ todoState, toggleTodo }}>
      {children}
    </TodoContext.Provider>
  );
};
