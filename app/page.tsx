export default function Page() {
  return (
    <section className="mx-auto max-w-3xl p-6">
      <h1 className="mb-2 text-2xl font-bold">Rayure</h1>
      <p className="text-neutral-600">
        Bienvenue ! Cette base démarre le projet (Next + TS + Tailwind). Utilise le Master Prompt
        pour scaffolder le CRM (tables, écrans, Kanban, etc.).
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a className="rounded border p-4" href="/crm/companies">CRM — Entreprises</a>
        <a className="rounded border p-4" href="/crm/contacts">CRM — Contacts</a>
        <a className="rounded border p-4" href="/events">Événements (Kanban)</a>
        <a className="rounded border p-4" href="/products">Produits</a>
        <a className="rounded border p-4" href="/expenses">Notes de frais</a>
        <a className="rounded border p-4" href="/tasks">Tâches</a>
      </div>
    </section>
  );
}

