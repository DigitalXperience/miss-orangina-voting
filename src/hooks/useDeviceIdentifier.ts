import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface UseDeviceIdentifierResult {
  deviceId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useDeviceIdentifier = (): UseDeviceIdentifierResult => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDeviceId = async () => {
      try {
        // On vérifie d'abord dans le localStorage
        const storedId = localStorage.getItem('device_identifier');
        if (storedId) {
          setDeviceId(storedId);
          setIsLoading(false);
          return;
        }

        // Si pas d'ID stocké, on en crée un nouveau
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const newDeviceId = result.visitorId;

        // On stocke l'ID pour les futures visites
        localStorage.setItem('device_identifier', newDeviceId);
        setDeviceId(newDeviceId);

      } catch (err) {
        console.error('Erreur lors de l\'identification de l\'appareil:', err);
        setError('Impossible d\'identifier votre appareil');
      } finally {
        setIsLoading(false);
      }
    };

    getDeviceId();
  }, []);

  return { deviceId, isLoading, error };
};