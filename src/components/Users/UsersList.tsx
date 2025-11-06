import React from 'react';
import { User } from 'src/types/api';
import { UserCard } from './UserCard';
import { DataList } from 'src/components/Common/DataList';

interface UsersListProps {
  users: User[];
  isLoading?: boolean;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onChangeRole?: (user: User) => void;
}

export function UsersList({ users, isLoading, onEditUser, onDeleteUser, onChangeRole }: UsersListProps) {
  return (
    <DataList
      items={users}
      isLoading={isLoading}
      gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      emptyState={{
        icon: '👥',
        title: 'No hay usuarios',
        description: 'Crea el primer usuario para comenzar',
      }}
      renderItem={(user) => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
          onChangeRole={onChangeRole}
        />
      )}
    />
  );
}
