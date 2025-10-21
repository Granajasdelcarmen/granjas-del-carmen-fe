const NavBar = () => {
    return (
        <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <section>
                <img src="/Positivo.png" alt="" />
                <h1>GRANJAS DEL CARMEN</h1>
            </section>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    );
}

export default NavBar;
