import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { getContactById, getContactInteractions } from '@/lib/supabase/queries/contacts';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContactInteractions } from '@/components/crm/contact-interactions';
import { InteractionFAB } from '@/components/crm/interaction-fab';
import { EditContactModal } from '@/components/crm/edit-contact-modal';
import { DeleteContactButton } from '@/components/crm/delete-contact-button';

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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>L'entreprise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contact.company ? (
                <>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Nom</div>
                    <Link
                      href={`/crm/companies/${contact.company.id}`}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {contact.company.name}
                    </Link>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Type</div>
                    <div className="text-sm text-foreground">
                      {contact.company.type === 'mairie' && 'Mairie'}
                      {contact.company.type === 'agence' && 'Agence'}
                      {contact.company.type === 'entreprise' && 'Entreprise'}
                      {contact.company.type === 'autre' && 'Autre'}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Aucune entreprise associée
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Historique récent</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactInteractions contactId={id} />
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

