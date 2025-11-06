import React from 'react';
import { useUsers, useRefetchUsers } from 'src/hooks/useUsers';
import { UsersTable } from './UsersTable';
import { SectionWrapper } from 'src/components/Common/SectionWrapper';
import { RefreshButton } from 'src/components/Common/RefreshButton';
import { useAuth } from 'src/hooks/useAuth';

export function UsersSection() {
  const { data: users, isLoading, error, isError } = useUsers();
  const refetchUsers = useRefetchUsers();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.sub;

  const handleRefetch = () => {
    refetchUsers();
  };

  return (
    <SectionWrapper
      title="Usuarios"
      icon="👥"
      description="Gestiona los usuarios del sistema"
      count={Array.isArray(users) ? users.length : 0}
      countLabel="usuarios"
      error={error || undefined}
      onRetry={handleRefetch}
      errorTitle="Error al cargar usuarios"
      actions={<RefreshButton onClick={handleRefetch} isLoading={isLoading} />}
    >
      <UsersTable 
        users={users || []} 
        isLoading={isLoading}
        currentUserId={currentUserId}
      />
    </SectionWrapper>
  );
}
