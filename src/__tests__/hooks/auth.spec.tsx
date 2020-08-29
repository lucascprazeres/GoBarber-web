import { renderHook, act } from "@testing-library/react-hooks"
import { useAuth, AuthProvider } from "../../hooks/auth";
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
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

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toBe('johndoe@example.com');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(result.current.user).toBeUndefined();
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
  });

  it('should be able to update user', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user123',
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: 'fake-img.jpg'
    }

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    )
  })
})