'use client';

import { createContext, useContext, useState } from 'react';

export type TabId = 'sanasto' | 'marraskuu' | 'joulukuu' | 'tammikuu' | 'helmikuu' | 'maaliskuu' | 'paivakirja' | 'raportit';

export const ALL_TABS: TabId[] = [
  'sanasto', 'marraskuu', 'joulukuu', 'tammikuu', 'helmikuu', 'maaliskuu', 'paivakirja', 'raportit',
];

interface TeacherContextValue {
  visibleTabs: TabId[];
  setVisibleTabs: (tabs: TabId[]) => void;
  activeLevel: 1 | 2 | 3 | 4;
  setActiveLevel: (level: 1 | 2 | 3 | 4) => void;
}

const TeacherContext = createContext<TeacherContextValue | null>(null);

export function TeacherProvider({ children }: { children: React.ReactNode }) {
  const [visibleTabs, setVisibleTabs] = useState<TabId[]>([...ALL_TABS]);
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4>(1);

  return (
    <TeacherContext.Provider value={{ visibleTabs, setVisibleTabs, activeLevel, setActiveLevel }}>
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacher(): TeacherContextValue {
  const ctx = useContext(TeacherContext);
  if (!ctx) throw new Error('useTeacher must be used within TeacherProvider');
  return ctx;
}
