import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "../services/mutations";
import { useTodo, useTodoIds } from "../services/queries";
import { Todo } from "../types/todo";

export default function Todos() {
  const todosIdQuery = useTodoIds();
  const todoQueries = useTodo(todosIdQuery.data);
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const { register, handleSubmit } = useForm<Todo>();

  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data);
  };

  const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
    if (data) {
      updateTodoMutation.mutate({ ...data, checked: true });
    }
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutateAsync(id);
  };

  /* if (todosIdQuery.isPending) {
    return <span>loading...</span>;
  }

  if (todosIdQuery.isError) {
    return <span>there is an error!</span>;
  } */

  return (
    <>
      <p>Query function status: {todosIdQuery.fetchStatus}</p>
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>New todo:</h4>
        <input placeholder="Title" {...register("title")} />
        <br />
        <input placeholder="Description" {...register("description")} />
        <br />
        <input
          type="submit"
          disabled={createTodoMutation.isPending}
          value={createTodoMutation.isPending ? "Creating ..." : "Create Todo"}
        />
      </form>

      <ul>
        {todoQueries.map(({ data }) => (
          <li key={data?.id}>
            <div> Id: {data?.id}</div>
            <span>
              <strong>Title:</strong>
              {data?.title} <strong>Description:</strong>
              {data?.description}
            </span>

            <div>
              <button
                onClick={() => handleMarkAsDoneSubmit(data)}
                disabled={data?.checked}
              >
                {data?.checked ? "Done" : "Mark as done!"}
              </button>
              {data && data.id && (
                <button onClick={() => handleDeleteTodo(data.id!)}>Delete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
