// import React, { createContext, useState } from 'react';

// // Define the shape of the user data
// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// // Create a new context for user data
// export const UserContext = createContext<{
//   user: User | null;
//   setUser: React.Dispatch<React.SetStateAction<User | null>>;
// }>({
//   user: null,
//   setUser: () => {},
// });

// // Create a provider component that wraps the entire app
// export const UserProvider: React.FC = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };