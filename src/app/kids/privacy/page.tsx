export default function KidsPrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-(--container-padding) py-(--section-padding)">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-6">Kids Portal Privacy Policy</h1>
        <p className="text-sm text-(--text-muted) mb-8">COPPA Compliant — Last updated March 2026</p>

        <div className="bg-white rounded-xl p-8 border border-stone-200 space-y-6 text-(--text-secondary) text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-(--text-primary) mb-2">What We Collect</h2>
            <p>For child accounts, we collect ONLY:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Display name</strong> — A fun username chosen by the parent (not the child&apos;s real name)</li>
              <li><strong>Age range</strong> — Either &quot;5-8&quot; or &quot;9-12&quot; (we do NOT collect birthdates)</li>
              <li><strong>Game progress</strong> — Which games were played and scores earned</li>
            </ul>
            <p className="mt-2">We do NOT collect: real names, email addresses, photos, location data, or any other personal information from children.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-(--text-primary) mb-2">Parental Consent</h2>
            <p>A parent or guardian must create the child account. Parents verify via email before the account is activated. Parents can review all child data and delete the account at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-(--text-primary) mb-2">No Advertising</h2>
            <p>There are zero advertisements on the Kids Portal. We do not serve ads, use tracking pixels, or include any third-party analytics scripts on kids pages.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-(--text-primary) mb-2">No Data Sharing</h2>
            <p>We do not share any child data with third parties. Period. No analytics services, no advertisers, no data brokers.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-(--text-primary) mb-2">Parent Rights</h2>
            <p>Parents can at any time:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>View all data associated with their child&apos;s account</li>
              <li>Delete the child&apos;s account and all associated data</li>
              <li>Reset the child&apos;s login PIN</li>
              <li>Disable the account temporarily</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-(--text-primary) mb-2">Contact</h2>
            <p>For questions about children&apos;s privacy: <a href="mailto:ranchitacommunityorganization@gmail.com" className="text-gold-400 hover:underline">ranchitacommunityorganization@gmail.com</a></p>
            <p className="mt-1">MVVCSO, 37370 Montezuma Valley Rd, Ranchita, CA 92066</p>
          </section>
        </div>
      </div>
    </div>
  );
}
