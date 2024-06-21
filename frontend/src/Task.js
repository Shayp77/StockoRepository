export const Task = (props) =>
{
  return (
    <div>
      <h1>{props.taskName}</h1>
      <button onClick={() => props.deletetask(props.id)}>Delete</button>
    </div>
  )
}