import "./App.css";
import Saludo from "./components/saludo";
import Formulario from "./components/formulario";

function App() {
  return (
    <div className="contenedor">
      <header className="topbar">
        <div className="marca">
          <span className="marca-logo">AC</span>
          <span className="marca-nombre">AgendaConecta</span>
        </div>
        <span className="marca-version">Directorio Digital</span>
      </header>

      <h1>Tu Directorio de Contactos</h1>
      <p className="subtitulo">
        Organiza, edita y encuentra a las personas importantes para ti, todo en un solo lugar.
      </p>

      <div className="contenido">
        <div className="panel-izquierdo">
          <Saludo />
          <Formulario />
        </div>
      </div>
    </div>
  );
}

export default App;