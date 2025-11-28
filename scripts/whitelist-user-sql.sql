-- Ajouter l'utilisateur à la whitelist
-- Exécutez cette requête dans le SQL Editor de Supabase

INSERT INTO allowed_users (email, role)
VALUES ('loris@coupdepression.fr', 'owner')
ON CONFLICT (email) 
DO UPDATE SET role = 'owner';

-- Vérifier l'ajout
SELECT * FROM allowed_users WHERE email = 'loris@coupdepression.fr';

