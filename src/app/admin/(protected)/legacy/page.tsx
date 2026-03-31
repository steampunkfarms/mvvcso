import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { TreePine, Users, Mic, Map } from 'lucide-react';

export default async function AdminLegacyPage() {
  await requireAuth(['president', 'secretary']);

  const trees = await db.select().from(schema.familyTrees).orderBy(desc(schema.familyTrees.createdAt));
  const persons = await db.select().from(schema.familyPersons);
  const histories = await db.select().from(schema.oralHistories);
  const properties = await db.select().from(schema.propertyHistories);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Genealogy Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Family Trees</span>
            <TreePine className="w-5 h-5 text-gold-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{trees.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Total Persons</span>
            <Users className="w-5 h-5 text-stone-600" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{persons.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Oral Histories</span>
            <Mic className="w-5 h-5 text-terra-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{histories.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Properties</span>
            <Map className="w-5 h-5 text-sage-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{properties.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-200 bg-stone-100">
          <span className="text-sm font-semibold text-(--text-primary)">All Family Trees</span>
        </div>
        {trees.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No family trees created yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Name</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Persons</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Privacy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50">
              {trees.map(tree => (
                <tr key={tree.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-(--text-primary) font-medium">{tree.name}</td>
                  <td className="px-4 py-3 text-(--text-secondary)">{tree.personCount}</td>
                  <td className="px-4 py-3 text-(--text-muted) capitalize">{tree.privacy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
