// import { useEffect, useState } from "react";
// import { userApi } from "../../api";

// function UserList() {
//   const [userList, setUserList] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await userApi.getAllUsers(); // Lấy danh sách user từ API
//       const userList = response.data.data; // Lấy mảng user từ response
//       setUserList(userList); // Cập nhật state userList
//     };
//     fetchData();
//   }, []);

//   return (
//     <div>
//       {userList.map((user) => (
//         <div key={user.id}>
//           <p>Username: {user.username}</p>
//           <p>Email: {user.email}</p>
//           <p>Full Name: {user.fullName}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default UserList;