/**
 * Utilitaires de test légers pour le CRM
 */

export function formatCompanyType(type: string): string {
  const labels: Record<string, string> = {
    mairie: 'Mairie',
    agence: 'Agence',
    entreprise: 'Entreprise',
    autre: 'Autre',
  };
  return labels[type] || type;
}

export function formatInteractionType(type: string): string {
  const labels: Record<string, string> = {
    appel: 'Appel',
    email: 'Email',
    sms: 'SMS',
    rdv: 'Rendez-vous',
  };
  return labels[type] || type;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

