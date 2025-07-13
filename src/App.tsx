import List from "./components/List";

const App = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-white to-purple-100 py-20 flex items-center justify-center"
      data-testid="todo-app"
    >
      <List />
    </div>
  );
};

export default App;
