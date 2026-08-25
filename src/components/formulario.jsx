import { useState, useEffect } from "react";
import ContactoCard from "./ContactoCard";

// URL base de la API (JSON Server debe estar corriendo en el puerto 3001)
const API = "http://localhost:3001/contactos";

function Formulario() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // GET -- Cargar los contactos desde JSON Server cuando el componente se monta
  useEffect(() => {
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo conectar con el servidor");
        return res.json();
      })
      .then((data) => setContactos(data))
      .catch(() =>
        setError(
          "No pudimos cargar tus contactos porque el servidor no responde."
        )
      )
      .finally(() => setCargando(false));
  }, []);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    etiqueta: "",
  });

  const [editandoId, setEditandoId] = useState(null);

  // Mensajes de error por campo (checklist punto 1 y 2)
  const [erroresCampos, setErroresCampos] = useState({});

  // Evita envíos dobles y controla el texto/estado del botón (checklist punto 3 y 5)
  const [guardando, setGuardando] = useState(false);

  // Mensaje de éxito en verde cuando se guarda correctamente (mini reto punto 2)
  const [exito, setExito] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpia el error de ese campo apenas el usuario empieza a corregirlo
    setErroresCampos((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }

  // Revisa cada campo obligatorio y devuelve un mensaje humano y claro por campo
  function validarFormulario() {
    const nuevosErrores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "Escribe el nombre del contacto.";
    }

    if (!form.telefono.trim()) {
      nuevosErrores.telefono = "Escribe un número de teléfono.";
    } else if (form.telefono.trim().length < 7) {
      nuevosErrores.telefono =
        "El teléfono debe tener al menos 7 caracteres.";
    }

    return nuevosErrores;
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Si ya se está guardando, no dejamos que el formulario se envíe de nuevo
    if (guardando) return;

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresCampos(nuevosErrores);
      return;
    }

    setError(null);
    setExito(null);
    setGuardando(true);

    if (editandoId !== null) {
      // PUT -- Actualizar un contacto existente
      fetch(`${API}/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editandoId, ...form }),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((actualizado) => {
          setContactos((prev) =>
            prev.map((contacto) =>
              contacto.id === editandoId ? actualizado : contacto
            )
          );
          setExito("Contacto actualizado correctamente ✅");

          setForm({ nombre: "", apellido: "", telefono: "", etiqueta: "" });
          setEditandoId(null);
        })
        .catch(() =>
          setError(
            "No se pudo guardar el contacto porque el servidor no responde. Tus datos siguen aquí, intenta de nuevo."
          )
        )
        .finally(() => setGuardando(false));
    } else {
      // POST -- Agregar un nuevo contacto
      fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((nuevo) => {
          setContactos((prev) => [...prev, nuevo]);
          setExito("Contacto agregado correctamente ✅");

          setForm({ nombre: "", apellido: "", telefono: "", etiqueta: "" });
          setEditandoId(null);
        })
        .catch(() =>
          setError(
            "No se pudo agregar el contacto porque el servidor no responde. Tus datos siguen aquí, intenta de nuevo."
          )
        )
        .finally(() => setGuardando(false));
    }
  }

  function handleEditar(contacto) {
    setForm({
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      telefono: contacto.telefono,
      etiqueta: contacto.etiqueta,
    });

    setEditandoId(contacto.id);
    setErroresCampos({});
    setExito(null);
  }

  // El mensaje de éxito se oculta solo después de unos segundos
  useEffect(() => {
    if (!exito) return;
    const temporizador = setTimeout(() => setExito(null), 3000);
    return () => clearTimeout(temporizador);
  }, [exito]);

  function handleCancelarEdicion() {
    setForm({
      nombre: "",
      apellido: "",
      telefono: "",
      etiqueta: "",
    });

    setErroresCampos({});
    setEditandoId(null);
  }

  function handleEliminar(id) {
    // DELETE -- Eliminar un contacto por su id
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(() => {
        setContactos((prev) => prev.filter((contacto) => contacto.id !== id));

        if (editandoId === id) {
          setForm({
            nombre: "",
            apellido: "",
            telefono: "",
            etiqueta: "",
          });

          setEditandoId(null);
        }
      })
      .catch(() =>
        setError(
          "No se pudo eliminar el contacto porque el servidor no responde."
        )
      );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-7 items-start">

      <div className="lg:sticky lg:top-5">
        <div className="mb-4 px-1">
          <h2 className="text-white text-xl font-bold">
            {editandoId !== null ? "Editar contacto" : "Nuevo contacto"}
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            {editandoId !== null
              ? "Actualiza los datos y guarda los cambios"
              : "Completa el formulario para agregarlo a tu lista"}
          </p>
        </div>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border border-gray-200 rounded-xl shadow-lg p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              className={`w-full border rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 ${
                erroresCampos.nombre
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
            />
            {erroresCampos.nombre && (
              <p className="text-red-600 text-xs mt-1">
                {erroresCampos.nombre}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              className={`w-full border rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 ${
                erroresCampos.telefono
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
            />
            {erroresCampos.telefono && (
              <p className="text-red-600 text-xs mt-1">
                {erroresCampos.telefono}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="etiqueta"
              placeholder="Etiqueta (ej: Familia, Trabajo)"
              value={form.etiqueta}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {exito && (
            <p className="sm:col-span-2 text-center text-green-700 text-sm py-2.5 px-4 bg-green-100 border border-green-300 rounded-lg">
              {exito}
            </p>
          )}

          <div className="sm:col-span-2 flex gap-2.5 mt-1">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 transition"
            >
              {guardando
                ? "Guardando..."
                : editandoId !== null
                ? "Guardar cambios"
                : "Agregar contacto"}
            </button>

            {editandoId !== null && (
              <button
                type="button"
                onClick={handleCancelarEdicion}
                disabled={guardando}
                className="flex-1 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-white text-xl font-bold">Contactos</h2>
          <span className="text-slate-300 text-xs font-medium px-3.5 py-1.5 bg-white/10 border border-white/10 rounded-full">
            {contactos.length} {contactos.length === 1 ? "contacto" : "contactos"}
          </span>
        </div>

        {error && (
          <div className="mb-4 text-center text-red-200 text-sm py-3 px-4 bg-red-500/20 border border-red-400/30 rounded-xl">
            <p>⚠️ {error}</p>
            <p className="text-red-300/80 text-xs mt-1">
              Verifica que el servidor esté encendido:{" "}
              <code>json-server --watch db.json --port 3001</code>
            </p>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {cargando ? (
            <p className="col-span-full text-center text-slate-300 text-sm py-12 px-5 bg-white/5 border border-dashed border-white/20 rounded-xl">
              Cargando contactos...
            </p>
          ) : contactos.length === 0 ? (
            <p className="col-span-full text-center text-slate-300 text-sm py-12 px-5 bg-white/5 border border-dashed border-white/20 rounded-xl">
              Aún no tienes contactos guardados. ¡Agrega el primero! ✨
            </p>
          ) : (
            contactos.map((contacto) => (
              <ContactoCard
                key={contacto.id}
                nombre={contacto.nombre}
                apellido={contacto.apellido}
                telefono={contacto.telefono}
                etiqueta={contacto.etiqueta}
                onEditar={() => handleEditar(contacto)}
                onEliminar={() => handleEliminar(contacto.id)}
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default Formulario;
