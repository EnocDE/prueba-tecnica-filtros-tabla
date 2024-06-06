import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import UsersList from "./component/UserList";
import { SortBy, User, UserId } from "./types.d";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  // Nota: useRef se usa para almacenar un valor que queremos disponible entre renderizados pero que al cambiar no vuelva a renderizar al componente.
  // Nota: También se puede usar para hacer referencia a elementos del DOM
  const originalUsers = useRef<User[]>([])
  const [filterCountry, setFilterCountry] = useState<string | null>(null)


  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleDelete = (uuid: UserId) => {
    const filteredUsers = users.filter(user => user.login.uuid !== uuid)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=100")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        setUsers(data?.results)
        originalUsers.current = data?.results
      })
      .catch((error) => console.log(error));
  }, []);

  // Nota: Se debe filtrar primero y ordenar despues para que funcione ambas funcionalidades
  const filteredByCountry = useMemo(() => filterCountry != null && filterCountry?.length > 0
    ? users.filter(user => user.location.country.toLocaleLowerCase().includes(filterCountry.toLocaleLowerCase()))
    : users
    , [filterCountry, users])

  // Nota: Es recomendable no tener mas de un estado para lo mismo, en este caso aqui el mismo estado lo estamos utilizado pero sin mutarlo y retornando un nuevo arreglo con los datos ya ordenados
  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredByCountry

    // Se crea un objeto donde cada llave de SortBy devolvera una llave del objeto user
    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
    }

    // Retorna un nuevo arreglo ordenado por el tipo en el estado de sorting
    return filteredByCountry.toSorted((a, b) => {
      // Obtenemos la llave del objeto en la posición que tiene sorting en el arreglo de compareProperties
      const extractProperty = compareProperties[sorting]
      // Obtiene el valor del objeto a y b
      const valueA = extractProperty(a)
      const valueB = extractProperty(b)
      // Compara el valor de ambos para ordenar
      return valueA.localeCompare(valueB)
    })

  }, [filteredByCountry, sorting])

  return (
    <div className="div">
      <h1>Lista de usuarios</h1>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', width: '100%', marginBottom: '20px', gap: '5px' }}>
        <button onClick={toggleColors}>{showColors ? 'No colorear filas' : 'Colorear filas'}</button>

        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY ? 'No ordenar por pais' : 'Ordenar por pais'}
        </button>

        <button onClick={handleReset}>
          Restaurar usuarios eliminados
        </button>

        <input style={{ padding: '10px 5px', border: '1px solid gainsboro' }} placeholder="Buscar por pais" type="text" onChange={(e) => setFilterCountry(e.target.value)} />
      </header>

      <main>

        {
          users != null && users.length !== 0
            ? <UsersList users={sortedUsers} showColors={showColors} handleDelete={handleDelete} handleChangeSort={handleChangeSort} />
            : null
        }
      </main>
    </div>
  );
}

export default App;
