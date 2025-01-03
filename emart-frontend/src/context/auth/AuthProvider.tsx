'use client';

import React, {
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react';
// eslint-disable-next-line import/no-cycle
import { useAxiosInterceptors } from '../../service/axiosInstance';

interface AuthContextProps {
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);
function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useAxiosInterceptors();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);
  const value = useMemo(
    () => ({ accessToken, setAccessToken }),
    [accessToken, setAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
