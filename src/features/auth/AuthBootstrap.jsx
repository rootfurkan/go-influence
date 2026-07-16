import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authCleared, authFailed, authReady } from './authSlice';
import { subscribeToAuthChanges } from './authService';

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(({ firebaseUser, profile }) => {
      if (!firebaseUser) {
        dispatch(authCleared());
        return;
      }

      dispatch(
        authReady({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          },
          profile,
        }),
      );
    });

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('unhandledrejection', handleUnhandledAuthError);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledAuthError);

    function handleUnhandledAuthError(event) {
      if (event.reason?.code?.startsWith?.('auth/')) {
        dispatch(authFailed(event.reason.message));
      }
    }
  }, [dispatch]);

  return children;
}
