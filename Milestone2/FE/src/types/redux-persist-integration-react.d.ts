declare module 'redux-persist/integration/react' {
  import * as React from 'react';
  import type { Persistor } from 'redux-persist';

  export interface PersistGateProps {
    loading?: React.ReactNode | null;
    persistor: Persistor;
    onBeforeLift?: () => void;
    children?: React.ReactNode;
  }

  export class PersistGate extends React.PureComponent<PersistGateProps> {}
}
