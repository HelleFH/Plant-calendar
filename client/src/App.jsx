
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomeLayout, Login, Register, AllEntriesList} from "./pages";
import CalendarComponent from "./pages/CalendarView/Calendar";
import { ToastContainer } from 'react-toastify';
import './styles/main.scss';
import './styles/global-styles.scss'; // Import global styles


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <CalendarComponent />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "all-entries",
        element: <AllEntriesList />,
      },
      {
        path: "register",
        element: <Register />,
      },

      {
        path: "calendar",
        element: <CalendarComponent />,
      },
  
   

    ],
  },
]);

function App() {


  return (
    <>
        <RouterProvider router={router} />
        <ToastContainer position='top-center' />
    </>
  )
}

export default App
