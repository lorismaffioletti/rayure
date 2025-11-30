import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { getContactById, getContactInteractions } from '@/lib/supabase/queries/contacts';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { getUser } from '@/lib/auth/get-user';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContactInteractions } from '@/components/crm/contact-interactions';
import { InteractionFAB } from '@/components/crm/interaction-fab';
import { EditContactModal } from '@/components/crm/edit-contact-modal';
import { DeleteContactButton } from '@/components/crm/delete-contact-button';

function formatUserName(email: string | null | undefined): string {
  if (!email) return 'Utilisateur';
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')}`;
  }
  return name
    .split(/[._-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function ContactInteractionsWrapper({ contactId }: { contactId: string }) {
  const [interactions, user] = await Promise.all([
    getContactInteractions(contactId),
    getUser(),
  ]);
  const userName = formatUserName(user?.email);
  return <ContactInteractions contactId={contactId} interactions={interactions} userName={userName} />;
}

interface ContactPageProps {
  params: Promise<{ id: string }>;
}

const INTERACTION_ICONS: Record<string, string> = {
  appel: '📞',
  email: '✉️',
  sms: '💬',
  rdv: '📅',
};

export default async function ContactPage({ params }: ContactPageProps) {
  const { id } = await params;

  try {
    const [contact, interactions, companies] = await Promise.all([
      getContactById(id),
      getContactInteractions(id),
      getCompanies(),
    ]);

    return (
      <div className="page max-w-5xl pb-24">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <Link
              href="/crm/contacts"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Retour aux contacts
            </Link>
            <h1 className="mt-2 text-3xl font-bold">
              {contact.first_name} {contact.last_name}
            </h1>
            {contact.role && <p className="mt-1 text-sm text-muted-foreground">{contact.role}</p>}
          </div>
          <div className="flex items-center gap-2">
            <EditContactModal contact={contact} companies={companies}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </EditContactModal>
            <DeleteContactButton
              contactId={contact.id}
              contactName={`${contact.first_name} ${contact.last_name}`}
            >
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </DeleteContactButton>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contact.email && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Email</div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-foreground hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Téléphone</div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm text-foreground hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.source && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Source du contact</div>
                  <div className="text-sm text-foreground">{contact.source}</div>
                </div>
              )}
              {contact.meeting_date && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Date de rencontre</div>
                  <div className="text-sm text-foreground">
                    {new Date(contact.meeting_date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              {contact.company ? (
                <div className="flex items-center gap-2">
                  <CardTitle asChild>
                    <Link
                      href={`/crm/companies/${contact.company.id}`}
                      className="hover:underline"
                    >
                      {contact.company.name}
                    </Link>
                  </CardTitle>
                  <Badge variant="outline">
                    {contact.company.type === 'mairie' && 'Mairie'}
                    {contact.company.type === 'agence' && 'Agence'}
                    {contact.company.type === 'entreprise' && 'Entreprise'}
                    {contact.company.type === 'autre' && 'Autre'}
                  </Badge>
                </div>
              ) : (
                <CardTitle>Aucune entreprise</CardTitle>
              )}
            </CardHeader>
            {contact.company && (
              <CardContent>
                <Link
                  href={`/crm/companies/${contact.company.id}`}
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Voir la fiche entreprise →
                </Link>
              </CardContent>
            )}
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Historique récent</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactInteractionsWrapper contactId={id} />
          </CardContent>
        </Card>

        <InteractionFAB contactId={id} contactName={`${contact.first_name} ${contact.last_name}`} />
      </div>
    );
  } catch (error) {
    console.error('Error loading contact:', error);
    notFound();
  }
}

