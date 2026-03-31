import { requireAuth } from '@/lib/auth';
import { ExternalLink, BookOpen, Download } from 'lucide-react';

export default async function AdminBylawsPage() {
  await requireAuth(['president', 'secretary', 'treasurer', 'board_member']);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text-primary)">Bylaws Reference</h1>
        <a
          href="https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/MVVCSO_BYLAWS_Ratified_June_18_2025.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-sm font-medium text-(--text-secondary) hover:border-gold-400 hover:text-gold-400 transition-colors"
        >
          <Download className="w-4 h-4" /> Download PDF
        </a>
      </div>

      <div className="bg-gold-100/20 rounded-xl p-4 border border-gold-200 text-sm text-(--text-secondary)">
        <p><strong>Ratified:</strong> June 18, 2025 &middot; <strong>Version:</strong> 1.0</p>
        <p className="mt-1">This structured reference mirrors the official bylaws. The PDF is the legally binding version.</p>
      </div>

      <div className="space-y-4">
        <BylawArticle number="I" title="Offices">
          <BylawSection number="1" title="Principal Office">
            <p>The principal office is located at 37370 Montezuma Valley Rd, Ranchita, CA 92066, in the County of San Diego. The mailing address is also 37370 Montezuma Valley Rd, Ranchita, CA 92066. The Board may change the location within San Diego County by resolution, with notice to members.</p>
          </BylawSection>
        </BylawArticle>

        <BylawArticle number="II" title="Affiliation">
          <p className="text-sm text-(--text-secondary) leading-relaxed">MVVCSO may affiliate with other organizations as deemed advisable by the Board to further its mission. Affiliations must be approved by a simple majority vote and align with MVVCSO&apos;s purpose.</p>
        </BylawArticle>

        <BylawArticle number="III" title="Members">
          <BylawSection number="1" title="Classes of Membership">
            <ol className="list-decimal list-inside space-y-3 text-sm text-(--text-secondary)">
              <li><strong>Voting Member</strong> — At least 21 years old; primary residence within mapped boundary; written application approved by Board; remains in good standing.
                <p className="ml-5 mt-1 text-xs text-(--text-muted)">Good standing: at least one meeting attendance annually, signed pledge, no recorded misconduct. Voting membership required to sit on the Board.</p>
              </li>
              <li><strong>Non-Voting Member</strong> — Supports MVVCSO&apos;s mission but resides outside the boundary or doesn&apos;t meet Voting Member criteria.</li>
              <li><strong>Honorary Member</strong> — Significantly contributes time or resources; approved by majority Board vote. No voting rights.</li>
              <li><strong>Additional Classifications</strong> — Board may establish: Affiliate, Associate, Student/Youth, Supporting, Provisional, Legacy, Service, Organizational, Emeritus Members. Non-voting unless otherwise specified.</li>
            </ol>
          </BylawSection>
          <BylawSection number="2" title="Voting Rights">
            <ul className="list-disc list-inside space-y-1 text-sm text-(--text-secondary)">
              <li>One vote per Voting Member on elections, bylaw amendments, and major financial decisions</li>
              <li>May vote in person, by mail, or electronically</li>
              <li>No proxy voting</li>
              <li>Secretary maintains public roster, updated annually</li>
            </ul>
          </BylawSection>
          <BylawSection number="3" title="Membership Enrollment & Verification">
            <ul className="list-disc list-inside space-y-1 text-sm text-(--text-secondary)">
              <li>Written application + Board approval within 60 days</li>
              <li>Voting Member status requires residency verification</li>
              <li>&quot;Good standing&quot; defined in publicly available policy</li>
            </ul>
          </BylawSection>
          <BylawSection number="4" title="Member Meetings">
            <ul className="list-disc list-inside space-y-1 text-sm text-(--text-secondary)">
              <li>Annual General Meeting each December — 30 days&apos; public notice required</li>
              <li>Special meetings: called by President, majority of Board, or 5% of Voting Members (10–90 days notice)</li>
              <li>Quorum loss: reconvene within 14–60 days with 7 days&apos; notice</li>
            </ul>
          </BylawSection>
        </BylawArticle>

        <BylawArticle number="IV" title="Board of Directors">
          <BylawSection number="1" title="Composition and Term">
            <ul className="list-disc list-inside space-y-1 text-sm text-(--text-secondary)">
              <li>5 to 9 Directors — Voting Members in good standing, 21+, full-time residents</li>
              <li>Two-year terms, limit of three consecutive terms, staggered</li>
              <li>No more than one household member simultaneously</li>
              <li>Board may adjust size with 30 days&apos; notice and community forum</li>
            </ul>
          </BylawSection>
          <BylawSection number="2" title="Powers">
            <ul className="list-disc list-inside space-y-1 text-sm text-(--text-secondary)">
              <li>Manage affairs, authorize expenditures, oversee facilities</li>
              <li>Pursue grants and partnerships with Voting Member input</li>
              <li>Major expenditures (&gt;$10,000) require Voting Member approval with community forum</li>
            </ul>
          </BylawSection>
          <BylawSection number="3" title="Meetings">
            <ul className="list-disc list-inside space-y-1 text-sm text-(--text-secondary)">
              <li>Regular meetings at least quarterly, open to public, agendas posted 7 days in advance</li>
              <li>Quorum: simple majority of seated Directors; President breaks ties</li>
              <li>Special meetings: 48 hours&apos; notice</li>
              <li>Minutes published within 14 days</li>
              <li>Remote participation counts toward quorum</li>
            </ul>
          </BylawSection>
          <BylawSection number="4" title="Removal of Directors">
            <ul className="list-disc list-inside space-y-1 text-sm text-(--text-secondary)">
              <li>For cause: two-thirds vote of Voting Members at special meeting with 30 days&apos; notice</li>
              <li>Three consecutive missed meetings without cause: majority Board vote with 14-day response period</li>
            </ul>
          </BylawSection>
          <BylawSection number="5" title="Vacancies">
            <p className="text-sm text-(--text-secondary)">Below quorum: Secretary notifies Voting Members within 7 days. 30-day solicitation of candidates. Remaining Board may appoint by majority vote. Term extensions allowed up to 60 days.</p>
          </BylawSection>
          <BylawSection number="6" title="Conflict of Interest">
            <p className="text-sm text-(--text-secondary)">Directors and officers must disclose financial or personal interests and recuse from related votes. Comprehensive policy compliant with California law. Failure to disclose is grounds for removal.</p>
          </BylawSection>
          <BylawSection number="7" title="Board Vacancy and Crisis Management">
            <ul className="list-disc list-inside space-y-1 text-sm text-(--text-secondary)">
              <li><strong>One Director remaining:</strong> may authorize operational expenditures up to $300/instance ($900/month cap), call Emeritus Board Members</li>
              <li><strong>Completely vacated Board:</strong> Emeritus Members may convene as interim voting Directors per Board-approved SOP</li>
            </ul>
          </BylawSection>
          <BylawSection number="8" title="Emergency Powers">
            <p className="text-sm text-(--text-secondary)">Board may take urgent actions by majority vote, expending up to $10,000 without member approval. Must report to Voting Members within 14 days.</p>
          </BylawSection>
        </BylawArticle>

        <BylawArticle number="V" title="Officers">
          <BylawSection number="1" title="Officer Roles">
            <p className="text-sm text-(--text-secondary)">President, Vice President, Secretary, Treasurer. Additional Vice roles may be appointed as needed.</p>
          </BylawSection>
          <BylawSection number="2" title="Election and Term">
            <p className="text-sm text-(--text-secondary)">Elected annually by the Board at the first meeting after the AGM. One-year terms, renewable up to five years.</p>
          </BylawSection>
          <BylawSection number="3" title="Duties">
            <ul className="list-disc list-inside space-y-1 text-sm text-(--text-secondary)">
              <li><strong>President:</strong> CEO, presides at meetings, leads strategic planning, ensures transparency</li>
              <li><strong>Vice President:</strong> Assumes President&apos;s duties in absence, assists with grants and outreach</li>
              <li><strong>Secretary:</strong> Records/publishes minutes, maintains membership roster, manages elections</li>
              <li><strong>Treasurer:</strong> Manages finances, monthly/annual reports, grant compliance; may be bonded if handling &gt;$10,000</li>
            </ul>
          </BylawSection>
        </BylawArticle>

        <BylawArticle number="VI" title="Committees">
          <BylawSection number="1" title="Standing Committees">
            <ol className="list-decimal list-inside space-y-1 text-sm text-(--text-secondary)">
              <li><strong>Finance Committee:</strong> 2 Directors + 3 Voting Members — budgets, audits, compliance</li>
              <li><strong>Grant Committee:</strong> 1 Director + 2 Voting Members — research, draft, comply</li>
              <li><strong>Community Engagement:</strong> 1 Director + 3 Voting Members — forums, feedback, promotion</li>
              <li><strong>Ethics Committee:</strong> Formed as needed — investigates complaints</li>
              <li><strong>Election Committee:</strong> 1+ Director + 2 Voting Members — oversees elections and votes</li>
            </ol>
          </BylawSection>
          <BylawSection number="2" title="Appointments">
            <p className="text-sm text-(--text-secondary)">Committees appointed by the Board, Chairs designated by the President. Must reflect inclusivity goals.</p>
          </BylawSection>
        </BylawArticle>

        <BylawArticle number="VII" title="Corporate Records and Reports">
          <BylawSection number="1" title="Records">
            <p className="text-sm text-(--text-secondary)">Accurate records of minutes, finances, and membership at the principal office, with accommodations for non-digital residents.</p>
          </BylawSection>
          <BylawSection number="2" title="Inspection">
            <p className="text-sm text-(--text-secondary)">Open to Voting Members and Directors with 7 days&apos; written notice. Limited online access (view-only) with Board approval, CCPA compliant.</p>
          </BylawSection>
          <BylawSection number="3" title="Annual Report">
            <p className="text-sm text-(--text-secondary)">Published by January 31, covering activities, finances, and grants. Certified by President, Secretary, or CPA.</p>
          </BylawSection>
          <BylawSection number="4" title="Fiscal Year">
            <p className="text-sm text-(--text-secondary)">January 1 to December 31, unless changed by Board resolution with 30 days&apos; notice.</p>
          </BylawSection>
        </BylawArticle>

        <BylawArticle number="VIII" title="Bylaws">
          <p className="text-sm text-(--text-secondary)">Amended by two-thirds Board vote + majority Voting Member vote at special meeting or mail/electronic ballot, with 30 days&apos; public notice and feedback period.</p>
        </BylawArticle>

        <BylawArticle number="IX" title="Dissolution">
          <p className="text-sm text-(--text-secondary)">Assets distributed to a nonprofit with similar mission serving Ranchita or a neighboring community, per California Corporations Code &sect; 6716 and IRS requirements.</p>
        </BylawArticle>

        <BylawArticle number="X" title="Indemnification and Insurance">
          <ul className="list-disc list-inside space-y-1 text-sm text-(--text-secondary)">
            <li>Indemnifies Directors, officers, and volunteers per CA Corporations Code &sect; 5238</li>
            <li>May maintain D&amp;O, General Liability, and Property Insurance; reviewed annually</li>
          </ul>
        </BylawArticle>

        <BylawArticle number="XI" title="Whistleblower Protection">
          <p className="text-sm text-(--text-secondary)">Policy prohibiting retaliation against individuals reporting suspected misconduct in good faith. Ethics Committee investigates confidentially.</p>
        </BylawArticle>

        <BylawArticle number="XII" title="Inclusivity">
          <p className="text-sm text-(--text-secondary)">MVVCSO commits to inclusivity, ensuring governance and programs reflect and support all residents, regardless of age, income, disability, or background.</p>
        </BylawArticle>

        <BylawArticle number="XIII" title="Volunteer Programs">
          <p className="text-sm text-(--text-secondary)">The Board shall establish volunteer programs for community services, coordinated by a Volunteer Committee, with training and recognition.</p>
        </BylawArticle>

        <BylawArticle number="XIV" title="Grant and Program Support">
          <p className="text-sm text-(--text-secondary)">The Board shall pursue grants and develop programs to meet community needs, with input from the Grant Committee and public forums. Programs include targeted support for residents facing sudden hardships.</p>
        </BylawArticle>

        <BylawArticle number="XV" title="Accessibility">
          <p className="text-sm text-(--text-secondary)">All materials and meetings accessible: large-print forms, translation services, technical support. Compliant with ADA (28 CFR &sect; 36) and CA Civil Code &sect; 51 (Unruh Act). Volunteer-driven carpools within the boundary. Annual budget for accessibility and transportation.</p>
        </BylawArticle>

        <BylawArticle number="XVI" title="Emergency Response">
          <p className="text-sm text-(--text-secondary)">In crises, the Board may act swiftly to protect the community, with actions reported to Voting Members within 14 days.</p>
        </BylawArticle>

        <BylawArticle number="XVII" title="Construction">
          <p className="text-sm text-(--text-secondary)">Terms interpreted per the California Corporations Code and applicable nonprofit laws.</p>
        </BylawArticle>
      </div>
    </div>
  );
}

function BylawArticle({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-stone-200 bg-stone-100">
        <h2 className="font-semibold text-(--text-primary) flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gold-400" />
          Article {number}: {title}
        </h2>
      </div>
      <div className="px-5 py-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

function BylawSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-(--text-primary) mb-2">Section {number}: {title}</h3>
      {children}
    </div>
  );
}
