import { getAllFiles } from "../services/files";
import { useEffect, useState } from "react";

function Home() {
  const [files, setFiles] = useState();

  useEffect(() => {
    getAllFiles().then((data) => setFiles(data));
  }, []);

  return <div>{JSON.stringify(files)}</div>;
}

export default Home;
