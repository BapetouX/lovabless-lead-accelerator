import { useState, useEffect } from "react";

interface Objectives {
  postsPerMonth: number;
  leadsPerMonth: number;
  competitorsToTrack: number;
}

const DEFAULT_OBJECTIVES: Objectives = {
  postsPerMonth: 25,
  leadsPerMonth: 50,
  competitorsToTrack: 10,
};

export const useObjectives = () => {
  const [objectives, setObjectives] = useState<Objectives>(DEFAULT_OBJECTIVES);

  // Charger les objectifs depuis localStorage au démarrage
  useEffect(() => {
    const savedObjectives = localStorage.getItem('linkedin-objectives');
    if (savedObjectives) {
      try {
        const parsed = JSON.parse(savedObjectives);
        setObjectives({ ...DEFAULT_OBJECTIVES, ...parsed });
      } catch (error) {
        console.error('Erreur lors du chargement des objectifs:', error);
      }
    }
  }, []);

  // Sauvegarder les objectifs dans localStorage
  const updateObjectives = (newObjectives: Partial<Objectives>) => {
    const updated = { ...objectives, ...newObjectives };
    setObjectives(updated);
    localStorage.setItem('linkedin-objectives', JSON.stringify(updated));
  };

  return {
    objectives,
    updateObjectives,
  };
};