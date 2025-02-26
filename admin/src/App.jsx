import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/home";
import AllProduct from "./pages/allProducts";
import CreateProductForm from "./pages/create-new";
import UpdateProduct from "./pages/updateProduct";
import { Toaster } from "react-hot-toast";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}> 
      <>
        <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-products" element={<AllProduct />} />
            <Route path="/new-product" element={<CreateProductForm />} />
            <Route path="/update-product/:id" element={<UpdateProduct />} />
          </Routes>
        </BrowserRouter>
      </>
    </QueryClientProvider>
  );
}

export default App;
