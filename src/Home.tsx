import "./Home.css";

const Home = () => {
  return (
    <>
      <h1 className="text-white text-center text-4xl">Super Board</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <div className="divide-y divide-solid">title</div>
          <div>url</div>
        </div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
      <button className="bg-blue-500 py-4 px-8 rounded-lg">+</button>
    </>
  );
};

export default Home;
