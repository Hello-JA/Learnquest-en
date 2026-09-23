import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "@/lib/legal";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <LegalPage title="Terms of Use" updated={LEGAL_LAST_UPDATED}>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
            <p className="text-gray-800 m-0">
              <strong>Please read this first.</strong> LearnQuest is a product in
              development. This website is a preview. Nothing here is for sale, no
              purchase can be made, and the features described are plans rather than
              promises.
            </p>
          </div>

          <LegalSection title="What this website is">
            <p>
              This site describes a learning product we are building, offers a small
              practice demo, and lets you join a waitlist. That is the whole of it. There
              are no user accounts, no subscriptions, and no way to pay us.
            </p>
            <p>
              By using the site you agree to these terms. If you do not agree, please
              stop using it.
            </p>
          </LegalSection>

          <LegalSection title="Nothing here is an offer to sell">
            <p>
              Our pricing page shows plans and prices we are considering. Those figures
              are <strong>illustrative and not final</strong>. They are not an offer, they
              do not create a contract, and they may change or disappear entirely before
              launch.
            </p>
            <p>
              Joining the waitlist does not reserve a place, lock in a price, guarantee
              access, or oblige you to buy anything. It simply means we may email you when
              there is something to tell you.
            </p>
          </LegalSection>

          <LegalSection title="Features described are planned, not delivered">
            <p>
              Much of what this site describes — subjects beyond the demo, parent and
              teacher dashboards, progress tracking, offline access, team management —
              does not exist yet. We describe it to explain where we are heading.
            </p>
            <p>
              We may change direction, delay, or abandon any of it. Please do not make
              decisions that matter to you on the assumption that a described feature will
              arrive, or arrive on any particular date.
            </p>
          </LegalSection>

          <LegalSection title="The demo is a teaching sample">
            <p>
              The practice demo is a small illustration of our approach, not a curriculum
              or an assessment. It does not measure ability, diagnose a learning
              difficulty, or replace teaching. Results are not recorded and should not be
              used to make decisions about a child&rsquo;s education.
            </p>
            <p>
              We have tested the demo&rsquo;s arithmetic and explanations, but if you spot
              a mistake we would genuinely like to hear about it at{" "}
              <a
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                className="text-blue-600 hover:underline"
              >
                {LEGAL_CONTACT_EMAIL}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="Acceptable use">
            <p>
              Please use the site normally: do not try to break it, gain access to parts
              of it that are not public, disrupt it for other people, or use automated
              tools to submit the waitlist form.
            </p>
          </LegalSection>

          <LegalSection title="Our content">
            <p>
              The design, text, and demo on this site belong to us. You are welcome to use
              the demo for learning and to share a link to it. Please do not copy the site
              or present its content as your own.
            </p>
          </LegalSection>

          <LegalSection title="No warranty">
            <p>
              The site is provided &ldquo;as is&rdquo;. We do not promise it will be
              available, uninterrupted, or free of errors, and we make no warranties about
              it to the fullest extent the law allows. It is a preview of unfinished work
              and should be treated as such.
            </p>
          </LegalSection>

          <LegalSection title="Limitation of liability">
            <p>
              To the fullest extent permitted by law, we are not liable for any indirect
              or consequential loss arising from your use of this website, or from relying
              on descriptions of features that are not yet built.
            </p>
            <p>
              Nothing in these terms limits liability that cannot legally be limited.
            </p>
          </LegalSection>

          <LegalSection title="Privacy">
            <p>
              What we collect and why is set out in our Privacy Policy. In short: an email
              address, only if you give us one, and nothing at all from the demo.
            </p>
          </LegalSection>

          <LegalSection title="Changes to these terms">
            <p>
              These terms will change as LearnQuest becomes a real product. The date at
              the top shows when they were last revised. Continuing to use the site after
              a change means you accept the revised terms.
            </p>
          </LegalSection>

          <LegalSection title="Contact">
            <p>
              Questions about these terms can go to{" "}
              <a
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                className="text-blue-600 hover:underline"
              >
                {LEGAL_CONTACT_EMAIL}
              </a>
              .
            </p>
          </LegalSection>
        </LegalPage>
      </main>
      <Footer />
    </div>
  );
}
