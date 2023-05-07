import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/index";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
    const queryClient = new QueryClient();
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/" element={<HomeScreen />}></Route>
                </Routes>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
