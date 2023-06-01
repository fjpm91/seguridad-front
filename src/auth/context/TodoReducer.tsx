import { Todo, TodoState } from "./TodoContext";

export type TodoAction =
  | { type: "add"; payload: Todo }
  | { type: "toggle"; payload: { id: string } };


export const todoReducer = (state: TodoState, action: TodoAction) => {
  switch (action.type) {
    case "add":
      return {
        ...state, // Todo lo que contenia el state anteriormente
        todos: [...state.todos, action.payload],
      };
    case "toggle":
      return {
        ...state, // Todo lo que contenia el state anteriormente
        todos: state.todos.map(({...todo}) =>{
            if (todo.id === action.payload.id) {
                todo.completed = !todo.completed
            }
            return todo;
        })
      };

    default:
      return state;
  }
};
