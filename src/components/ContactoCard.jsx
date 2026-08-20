function ContactoCard({ nombre, apellido, telefono, etiqueta, onEliminar, onEditar }) {
  const iniciales = `${nombre?.charAt(0) ?? ""}${apellido?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-lg">
      <div className="w-14 h-14 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center mb-3">
        {iniciales}
      </div>

      <h2 className="text-gray-800 font-bold text-lg">
        {nombre} {apellido}
      </h2>

      <p className="text-sm text-gray-600 mt-1">📞 {telefono}</p>

      {etiqueta && (
        <span className="inline-block mt-2 px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 border border-purple-500 text-xs font-semibold uppercase tracking-wide">
          {etiqueta}
        </span>
      )}

      <div className="flex justify-center gap-2.5 mt-5">
        <button
          onClick={onEditar}
          className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 text-xs font-semibold rounded-full px-4 py-2 transition"
        >
          Editar
        </button>
        <button
          onClick={onEliminar}
          className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-full px-4 py-2 transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default ContactoCard;