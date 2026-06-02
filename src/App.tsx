//TODO : Deuda técnica - App.tsx renderiza su propio `<Navbar />`, pero el Router (src/router/index.tsx) también renderiza `<Navbar />`. Esto resulta en DOBLE navbar en la UI. App.tsx parece ser un remanente no utilizado, ya que main.tsx monta directamente `<Router />`.
import Navbar from './shared/components/navbar';

function App() {
  return (
    <>
      <Navbar />
    </>
  );
}
export default App;