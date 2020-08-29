import { renderHook } from "@testing-library/react-hooks"
import { useAuth, AuthProvider } from "../../hooks/auth";
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to signin', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'token-123'
    }
    
    apiMock.onPost('sessions').reply(200, apiResponse);

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    await waitForNextUpdate();

    expect(result.current.user.email).toBe('johndoe@example.com');

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token
      );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user', 
      JSON.stringify(apiResponse.user)
      );
  });
})