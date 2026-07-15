import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserManager } from './useUserManager';
import { usersData } from '../../data/usersData';

describe('useUserManager', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUserManager());

    expect(result.current.search).toBe('');
    expect(result.current.editUser).toBeNull();
    expect(result.current.filteredUsers).toEqual(usersData);
  });

  it('should filter users based on search query', () => {
    const { result } = renderHook(() => useUserManager());
    const firstUser = usersData[0];

    act(() => {
      result.current.setSearch(firstUser.name.toUpperCase());
    });

    expect(result.current.filteredUsers.every(user => 
      user.name.toLowerCase().includes(firstUser.name.toLowerCase())
    )).toBe(true);
  });

  it('should delete a user from the list', () => {
    const { result } = renderHook(() => useUserManager());
    const targetId = usersData[0].id;

    act(() => {
      result.current.deleteUser(targetId);
    });

    expect(result.current.filteredUsers.find(u => u.id === targetId)).toBeUndefined();
    expect(result.current.filteredUsers.length).toBe(usersData.length - 1);
  });

  it('should manage the editing lifecycle', () => {
    const { result } = renderHook(() => useUserManager());
    const targetUser = usersData[0];

    act(() => {
      result.current.startEditing(targetUser);
    });
    expect(result.current.editUser).toEqual(targetUser);

    act(() => {
      result.current.handleEditChange('name', 'Updated Name');
    });
    expect(result.current.editUser?.name).toBe('Updated Name');

    act(() => {
      result.current.saveEdit();
    });
    expect(result.current.editUser).toBeNull();
    expect(result.current.filteredUsers.find(u => u.id === targetUser.id)?.name).toBe('Updated Name');
  });

  it('should cancel editing without saving changes', () => {
    const { result } = renderHook(() => useUserManager());
    const targetUser = usersData[0];

    act(() => {
      result.current.startEditing(targetUser);
      result.current.handleEditChange('name', 'Temporary Name');
      result.current.cancelEditing();
    });

    expect(result.current.editUser).toBeNull();
    expect(result.current.filteredUsers.find(u => u.id === targetUser.id)?.name).toBe(targetUser.name);
  });

  it('should do nothing when saveEdit is called without an editUser', () => {
    const { result } = renderHook(() => useUserManager());
    const initialData = [...result.current.filteredUsers];

    act(() => {
      result.current.saveEdit();
    });

    expect(result.current.filteredUsers).toEqual(initialData);
  });
});