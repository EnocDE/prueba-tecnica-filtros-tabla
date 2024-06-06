import { SortBy, UserId, type User } from "../types.d";

interface Props {
  users: User[];
  showColors: boolean
  handleDelete: (uuid: UserId) => void
  handleChangeSort: (sort: SortBy) => void
}

export default function UsersList({ users, showColors, handleDelete, handleChangeSort }: Props) {
  return (
    <>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Foto</th>
            <th style={{cursor: 'pointer'}} onClick={() => handleChangeSort(SortBy.NAME)}>Nombre</th>
            <th style={{cursor: 'pointer'}} onClick={() => handleChangeSort(SortBy.LAST)}>Apellido</th>
            <th style={{cursor: 'pointer'}} onClick={() => handleChangeSort(SortBy.COUNTRY)}>Pais</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const currentRowColor = showColors && index % 2 === 0 ? 'color-rows' : 'color-rows-even'
            const isColorsActivated = showColors ? currentRowColor : 'quit-color-rows'
            return (
              <tr key={user.login.uuid} className={isColorsActivated}>
                <td>
                  <img
                    src={user.picture.thumbnail}
                    alt={`${user.name.first} ${user.name.last} profile picture`}
                  />
                </td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td>
                  <button style={{ background: 'crimson', color: 'white' }} onClick={() => handleDelete(user.login.uuid)}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
