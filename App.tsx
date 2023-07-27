import InitialNavigationRoutes from './screens/initialScreens/InitialNavigationRoutes';
import { Provider } from 'react-redux';
import { store } from './redux/Store';

export default function App() {
  return (
    <Provider store={store}>
      <InitialNavigationRoutes />
    </Provider>
  );
}
