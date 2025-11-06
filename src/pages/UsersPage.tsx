import React from 'react';
import { UsersSection } from 'src/components/Users/UsersSection';
import { RoleGate } from 'src/components/auth/RoleGate';

export function UsersPage() {
  return (
    <RoleGate allowedRoles={['admin']}>
      <UsersSection />
    </RoleGate>
  );
}

