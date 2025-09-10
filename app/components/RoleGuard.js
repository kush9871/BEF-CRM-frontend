'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RoleGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !session.user?.role) {
      router.replace('http://localhost:3000');
    } else {
      setAllowed(true);
    }
  }, [session, status, router]);

  if (status === 'loading' || !allowed) {
    return null; // Don't render anything until session is validated
  }

  return <>{children}</>;
}
