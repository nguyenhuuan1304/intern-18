import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { ToastContainer } from "react-toastify";
import Loading from "./components/Loading";

function App() {
  const routing = useRoutes(routes);

  return (
    <>
      <Suspense
        fallback={
          <div>
            <Loading />
          </div>
        }
      >
        {routing}
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
