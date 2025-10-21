import NavBar from "../navbar";

function MainLayout() {
  const name : string = "Hola Mundo";

  return <div>
    <NavBar />
    <main>
      <h1>Welcome, {name}!</h1>
    </main>
  </div>;
}

export default MainLayout;
