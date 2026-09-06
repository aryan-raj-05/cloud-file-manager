import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-blue-500 text-white flex justify-between p-4 pl-6 pr-6">
      <div>Hello World!</div>
      <Button onClick={() => setCount(count + 1)}>Click Here</Button>
      <div>{count}</div>
    </div>
  );
}

export default App;
