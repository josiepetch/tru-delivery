import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';
import Forget from './Forget';
import Protected from './Protected';
import Delivery from './Delivery';
import DeliveryInsert from './DeliveryInsert';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/delivery" element={<Protected Component={Delivery} />} />
        <Route path="/delivery/insert" element={<Protected Component={DeliveryInsert} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
